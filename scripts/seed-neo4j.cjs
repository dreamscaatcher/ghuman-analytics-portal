#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const neo4j = require("neo4j-driver");

async function seed() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  console.log("🌱 Seeding Neo4j database...\n");

  // Create Channels
  console.log("📺 Creating Channels...");
  await driver.executeQuery(`
    UNWIND ['Email', 'Social', 'Search', 'Display', 'Referral'] AS name
    CREATE (c:Channel {id: apoc.create.uuid(), name: name})
  `).catch(() => driver.executeQuery(`
    UNWIND ['Email', 'Social', 'Search', 'Display', 'Referral'] AS name
    CREATE (c:Channel {id: randomUUID(), name: name})
  `));

  // Create Campaigns with spend
  console.log("📢 Creating Campaigns...");
  await driver.executeQuery(`
    UNWIND [
      {name: 'Summer Sale 2024', spend: 15000, startDate: '2024-06-01'},
      {name: 'Back to School', spend: 22000, startDate: '2024-08-15'},
      {name: 'Holiday Promo', spend: 35000, startDate: '2024-11-20'},
      {name: 'New Year Launch', spend: 18000, startDate: '2025-01-01'},
      {name: 'Spring Collection', spend: 12000, startDate: '2025-03-01'}
    ] AS c
    CREATE (camp:Campaign {id: randomUUID(), name: c.name, spend: c.spend, startDate: date(c.startDate)})
  `);

  // Link Campaigns to Channels
  console.log("🔗 Linking Campaigns to Channels...");
  await driver.executeQuery(`
    MATCH (camp:Campaign), (ch:Channel)
    WITH camp, ch, rand() AS r
    WHERE r > 0.5
    CREATE (camp)-[:USES]->(ch)
  `);

  // Create Stores with coordinates
  console.log("🏪 Creating Stores...");
  await driver.executeQuery(`
    UNWIND [
      {name: 'Downtown', lat: 37.7749, lon: -122.4194},
      {name: 'Marina District', lat: 37.8024, lon: -122.4382},
      {name: 'Mission Bay', lat: 37.7699, lon: -122.3931},
      {name: 'Castro', lat: 37.7609, lon: -122.4350},
      {name: 'Sunset', lat: 37.7602, lon: -122.4874},
      {name: 'Richmond', lat: 37.7799, lon: -122.4644},
      {name: 'SOMA', lat: 37.7785, lon: -122.3950},
      {name: 'Nob Hill', lat: 37.7930, lon: -122.4161}
    ] AS s
    CREATE (store:Store {id: randomUUID(), name: s.name, latitude: s.lat, longitude: s.lon})
  `);

  // Create GeoCells
  console.log("🗺️  Creating GeoCells...");
  await driver.executeQuery(`
    UNWIND range(1, 20) AS i
    CREATE (g:GeoCell {
      id: randomUUID(),
      code: 'GC-' + toString(i),
      centerLat: 37.75 + (rand() * 0.1),
      centerLon: -122.45 + (rand() * 0.1),
      population: toInteger(5000 + rand() * 45000)
    })
  `);

  // Link Stores to nearby GeoCells
  console.log("🔗 Linking Stores to GeoCells...");
  await driver.executeQuery(`
    MATCH (s:Store), (g:GeoCell)
    WITH s, g, rand() AS r
    WHERE r > 0.7
    CREATE (s)-[:NEAR {distance: rand() * 2.0}]->(g)
  `);

  // Create Customers with cohorts
  console.log("👥 Creating Customers...");
  await driver.executeQuery(`
    UNWIND range(1, 50) AS i
    CREATE (c:Customer {
      id: randomUUID(),
      email: 'customer' + toString(i) + '@example.com',
      name: 'Customer ' + toString(i),
      cohortDate: date('2024-01-01') + duration({days: toInteger(rand() * 300)}),
      ltv: toInteger(rand() * 2000),
      segment: CASE WHEN rand() > 0.7 THEN 'Premium' WHEN rand() > 0.4 THEN 'Regular' ELSE 'New' END
    })
  `);

  // Link Customers to GeoCells
  console.log("🔗 Linking Customers to GeoCells...");
  await driver.executeQuery(`
    MATCH (c:Customer), (g:GeoCell)
    WITH c, g, rand() AS r
    ORDER BY r
    WITH c, collect(g)[0] AS geo
    CREATE (c)-[:LOCATED_IN]->(geo)
  `);

  // Create referral relationships (some customers referred others)
  console.log("🤝 Creating Referral relationships...");
  await driver.executeQuery(`
    MATCH (c1:Customer), (c2:Customer)
    WHERE c1 <> c2 AND rand() > 0.92
    WITH c1, c2 LIMIT 15
    CREATE (c1)-[:REFERRED {date: date('2024-01-01') + duration({days: toInteger(rand() * 300)})}]->(c2)
  `);

  // Create Orders linked to Customers and Campaigns
  console.log("🛒 Creating Orders...");
  await driver.executeQuery(`
    MATCH (c:Customer), (camp:Campaign)
    WITH c, camp, rand() AS r
    WHERE r > 0.85
    CREATE (o:Order {
      id: randomUUID(),
      value: toInteger(25 + rand() * 475),
      orderDate: camp.startDate + duration({days: toInteger(rand() * 60)}),
      items: toInteger(1 + rand() * 5)
    })
    CREATE (c)-[:ORDERED]->(o)
    CREATE (o)-[:FROM]->(camp)
  `);

  // Summary
  console.log("\n📊 Database seeded! Summary:");
  const summary = await driver.executeQuery(`
    MATCH (n)
    RETURN labels(n)[0] AS label, count(*) AS count
    ORDER BY count DESC
  `);
  summary.records.forEach(r => {
    console.log(`   ${r.get('label')}: ${r.get('count')}`);
  });

  const relSummary = await driver.executeQuery(`
    MATCH ()-[r]->()
    RETURN type(r) AS type, count(*) AS count
    ORDER BY count DESC
  `);
  console.log("\n🔗 Relationships:");
  relSummary.records.forEach(r => {
    console.log(`   ${r.get('type')}: ${r.get('count')}`);
  });

  await driver.close();
  console.log("\n✅ Done!");
}

seed().catch(e => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});

