#!/usr/bin/env node

/**
 * Superstore CSV Import Script
 *
 * Expected Schema:
 * - Node: Product (productId, name, subCategory)
 * - Node: Category (name)
 * - Node: City (name, state, country, region)
 * - Node: Region (name)
 * - Node: Customer (customerId, name, segment)
 * - Node: Order (orderId, orderDate, shipDate, shipMode)
 *
 * Relationships:
 * - (:Customer)-[:PLACED]->(:Order)
 * - (:Order)-[:CONTAINS {quantity, discount, sales, profit}]->(:Product)
 * - (:Product)-[:IN_CATEGORY]->(:Category)
 * - (:Customer)-[:LIVES_IN]->(:City)
 * - (:City)-[:IN_REGION]->(:Region)
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const neo4j = require("neo4j-driver");
const fs = require("fs");
const path = require("path");

async function importSuperstore() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  try {
    // Step 1: Clear existing data
    console.log("🗑️  Clearing existing data...");
    await session.run("MATCH (n) DETACH DELETE n");
    console.log("✅ Database cleared!\n");

    // Step 2: Read CSV file
    console.log("📂 Reading Superstore CSV...");
    const csvPath = path.join(__dirname, "..", "Sample - Superstore.csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const lines = csvContent.split("\n").filter((line) => line.trim());

    // Parse CSV rows (handling quoted fields with commas)
    const parseCSVLine = (line) => {
      const result = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const rows = lines.slice(1).map(parseCSVLine);
    console.log(`📊 Found ${rows.length} rows to import\n`);

    // Step 3: Create indexes for performance
    console.log("🔧 Creating indexes...");
    await session.run("CREATE INDEX IF NOT EXISTS FOR (c:Customer) ON (c.customerId)");
    await session.run("CREATE INDEX IF NOT EXISTS FOR (o:Order) ON (o.orderId)");
    await session.run("CREATE INDEX IF NOT EXISTS FOR (p:Product) ON (p.productId)");
    await session.run("CREATE INDEX IF NOT EXISTS FOR (r:Region) ON (r.name)");
    await session.run("CREATE INDEX IF NOT EXISTS FOR (c:City) ON (c.name)");
    await session.run("CREATE INDEX IF NOT EXISTS FOR (cat:Category) ON (cat.name)");
    console.log("✅ Indexes created!\n");

    // Step 4: Import data in batches
    console.log("📥 Importing data in batches...");
    const batchSize = 500;
    let imported = 0;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);

      const batchData = batch.map((row) => ({
        rowId: parseInt(row[0]) || 0,
        orderId: row[1],
        orderDate: row[2],
        shipDate: row[3],
        shipMode: row[4],
        customerId: row[5],
        customerName: row[6],
        segment: row[7],
        country: row[8],
        city: row[9],
        state: row[10],
        region: row[12],
        productId: row[13],
        category: row[14],
        subCategory: row[15],
        productName: row[16],
        sales: parseFloat(row[17]) || 0,
        quantity: parseInt(row[18]) || 0,
        discount: parseFloat(row[19]) || 0,
        profit: parseFloat(row[20]) || 0,
      }));

      await session.run(
        `
        UNWIND $batch AS row

        // Create or merge Region
        MERGE (region:Region {name: row.region})

        // Create or merge City (with state, country, region as properties)
        MERGE (city:City {name: row.city, state: row.state})
        ON CREATE SET city.country = row.country, city.region = row.region
        MERGE (city)-[:IN_REGION]->(region)

        // Create or merge Customer
        MERGE (customer:Customer {customerId: row.customerId})
        ON CREATE SET customer.name = row.customerName, customer.segment = row.segment
        MERGE (customer)-[:LIVES_IN]->(city)

        // Create or merge Category
        MERGE (category:Category {name: row.category})

        // Create or merge Product (without category property)
        MERGE (product:Product {productId: row.productId})
        ON CREATE SET product.name = row.productName, product.subCategory = row.subCategory
        MERGE (product)-[:IN_CATEGORY]->(category)

        // Create or merge Order (just order-level info, no line item details)
        MERGE (order:Order {orderId: row.orderId})
        ON CREATE SET order.orderDate = row.orderDate, order.shipDate = row.shipDate, order.shipMode = row.shipMode

        // Create relationships
        MERGE (customer)-[:PLACED]->(order)

        // CONTAINS relationship with transaction properties
        CREATE (order)-[:CONTAINS {
          rowId: row.rowId,
          quantity: row.quantity,
          discount: row.discount,
          sales: row.sales,
          profit: row.profit
        }]->(product)
        `,
        { batch: batchData }
      );

      imported += batch.length;
      process.stdout.write(`\r   Imported ${imported}/${rows.length} rows...`);
    }

    console.log("\n\n📊 Import complete! Summary:");

    // Get counts
    const summary = await session.run(`
      MATCH (n)
      RETURN labels(n)[0] AS label, count(*) AS count
      ORDER BY count DESC
    `);
    console.log("\n📦 Nodes:");
    summary.records.forEach((r) => {
      console.log(`   ${r.get("label")}: ${r.get("count")}`);
    });

    const relSummary = await session.run(`
      MATCH ()-[r]->()
      RETURN type(r) AS type, count(*) AS count
      ORDER BY count DESC
    `);
    console.log("\n🔗 Relationships:");
    relSummary.records.forEach((r) => {
      console.log(`   ${r.get("type")}: ${r.get("count")}`);
    });

    console.log("\n✅ Superstore data imported successfully!");
  } catch (error) {
    console.error("\n❌ Import failed:", error.message);
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
}

importSuperstore();

