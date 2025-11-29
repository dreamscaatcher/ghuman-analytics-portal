import { NextResponse } from "next/server";
import { getSession } from "@/lib/neo4j";

// Helper to safely convert Neo4j values (handles both Integer and Float)
const toNumber = (val: unknown): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && "toNumber" in val && typeof (val as { toNumber: () => number }).toNumber === "function") {
    return (val as { toNumber: () => number }).toNumber();
  }
  return Number(val) || 0;
};

export async function GET() {
  const session = getSession();

  try {
    // Get overall counts
    const countsResult = await session.run(`
      MATCH (c:Customer) WITH count(c) AS customers
      MATCH (o:Order) WITH customers, count(o) AS orders
      MATCH (p:Product) WITH customers, orders, count(p) AS products
      MATCH (r:Region) WITH customers, orders, products, count(r) AS regions
      MATCH (cat:Category) WITH customers, orders, products, regions, count(cat) AS categories
      RETURN customers, orders, products, regions, categories
    `);
    const counts = countsResult.records[0];

    // Calculate total sales, profit, and averages from CONTAINS relationship properties
    const revenueResult = await session.run(`
      MATCH (:Order)-[c:CONTAINS]->(:Product)
      RETURN sum(c.sales) AS totalSales,
             sum(c.profit) AS totalProfit,
             avg(c.sales) AS avgOrderValue,
             sum(c.quantity) AS totalQuantity
    `);
    const revenue = revenueResult.records[0];

    const totalSales = toNumber(revenue.get("totalSales"));
    const totalProfit = toNumber(revenue.get("totalProfit"));
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    // Get customer segments breakdown
    const segmentsResult = await session.run(`
      MATCH (c:Customer)
      RETURN c.segment AS segment, count(c) AS count
      ORDER BY count DESC
    `);
    const segments = segmentsResult.records.map((r) => ({
      segment: r.get("segment"),
      count: toNumber(r.get("count")),
    }));

    // Get category performance (using Category nodes and IN_CATEGORY relationship)
    const categoryResult = await session.run(`
      MATCH (o:Order)-[c:CONTAINS]->(p:Product)-[:IN_CATEGORY]->(cat:Category)
      RETURN cat.name AS category,
             sum(c.sales) AS sales,
             sum(c.profit) AS profit,
             count(c) AS orders
      ORDER BY sales DESC
    `);
    const categoryPerformance = categoryResult.records.map((r) => ({
      category: r.get("category"),
      sales: Math.round(toNumber(r.get("sales"))),
      profit: Math.round(toNumber(r.get("profit"))),
      orders: toNumber(r.get("orders")),
      margin: Number(((toNumber(r.get("profit")) / toNumber(r.get("sales"))) * 100).toFixed(1)),
    }));

    // Get regional performance (using LIVES_IN and IN_REGION relationships)
    const regionResult = await session.run(`
      MATCH (cust:Customer)-[:PLACED]->(o:Order)-[c:CONTAINS]->(:Product)
      MATCH (cust)-[:LIVES_IN]->(city:City)-[:IN_REGION]->(region:Region)
      RETURN region.name AS region,
             count(DISTINCT cust) AS customers,
             sum(c.sales) AS sales,
             sum(c.profit) AS profit
      ORDER BY sales DESC
    `);
    const regionPerformance = regionResult.records.map((r) => ({
      region: r.get("region"),
      customers: toNumber(r.get("customers")),
      sales: Math.round(toNumber(r.get("sales"))),
      profit: Math.round(toNumber(r.get("profit"))),
    }));

    // Get top 5 states by sales (using city.state property)
    const stateResult = await session.run(`
      MATCH (cust:Customer)-[:PLACED]->(o:Order)-[c:CONTAINS]->(:Product)
      MATCH (cust)-[:LIVES_IN]->(city:City)
      RETURN city.state AS state,
             sum(c.sales) AS sales,
             sum(c.profit) AS profit
      ORDER BY sales DESC
      LIMIT 5
    `);
    const topStates = stateResult.records.map((r) => ({
      state: r.get("state"),
      sales: Math.round(toNumber(r.get("sales"))),
      profit: Math.round(toNumber(r.get("profit"))),
    }));

    return NextResponse.json({
      summary: {
        totalCustomers: toNumber(counts.get("customers")),
        totalOrders: toNumber(counts.get("orders")),
        totalProducts: toNumber(counts.get("products")),
        totalRegions: toNumber(counts.get("regions")),
        totalCategories: toNumber(counts.get("categories")),
        totalSales: Math.round(totalSales),
        totalProfit: Math.round(totalProfit),
        avgOrderValue: Math.round(toNumber(revenue.get("avgOrderValue"))),
        totalQuantity: toNumber(revenue.get("totalQuantity")),
        profitMargin: Number(profitMargin.toFixed(1)),
      },
      segments,
      categoryPerformance,
      regionPerformance,
      topStates,
    });
  } catch (error) {
    console.error("Analytics query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}

