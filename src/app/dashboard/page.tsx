"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  summary: {
    totalCustomers: number;
    totalOrders: number;
    totalProducts: number;
    totalRegions: number;
    totalCategories: number;
    totalSales: number;
    totalProfit: number;
    avgOrderValue: number;
    totalQuantity: number;
    profitMargin: number;
  };
  segments: { segment: string; count: number }[];
  categoryPerformance: {
    category: string;
    sales: number;
    profit: number;
    orders: number;
    margin: number;
  }[];
  regionPerformance: {
    region: string;
    customers: number;
    sales: number;
    profit: number;
  }[];
  topStates: {
    state: string;
    sales: number;
    profit: number;
  }[];
}

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  borderRadius: 16,
  padding: 24,
  border: "1px solid rgba(255,255,255,0.1)",
};

const statCardStyle: React.CSSProperties = {
  ...cardStyle,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics/overview")
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
        Loading analytics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "#ef4444" }}>
        Error: {error || "Failed to load data"}
      </div>
    );
  }

  const { summary, segments, categoryPerformance, regionPerformance, topStates } = data;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>📊 Superstore Analytics Dashboard</h1>
        <p style={{ color: "#94a3b8", marginTop: 8 }}>
          Real-time retail KPIs powered by Neo4j Graph Database
        </p>
      </header>

      {/* KPI Cards */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <div style={statCardStyle}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Total Sales</span>
          <span style={{ fontSize: "2rem", fontWeight: 700, color: "#22c55e" }}>
            ${summary.totalSales.toLocaleString()}
          </span>
        </div>
        <div style={statCardStyle}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Total Profit</span>
          <span style={{ fontSize: "2rem", fontWeight: 700, color: summary.totalProfit >= 0 ? "#22c55e" : "#ef4444" }}>
            ${summary.totalProfit.toLocaleString()}
          </span>
        </div>
        <div style={statCardStyle}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Profit Margin</span>
          <span style={{ fontSize: "2rem", fontWeight: 700, color: summary.profitMargin >= 10 ? "#22c55e" : "#f59e0b" }}>
            {summary.profitMargin}%
          </span>
        </div>
        <div style={statCardStyle}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Avg Order Value</span>
          <span style={{ fontSize: "2rem", fontWeight: 700 }}>
            ${summary.avgOrderValue}
          </span>
        </div>
      </section>

      {/* Second row of stats */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 32 }}>
        <div style={statCardStyle}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Customers</span>
          <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>{summary.totalCustomers.toLocaleString()}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Orders</span>
          <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>{summary.totalOrders.toLocaleString()}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Products</span>
          <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>{summary.totalProducts.toLocaleString()}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Regions</span>
          <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>{summary.totalRegions}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Units Sold</span>
          <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>{summary.totalQuantity.toLocaleString()}</span>
        </div>
      </section>

      {/* Segments and Category Performance */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
        {/* Customer Segments */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "1.1rem" }}>Customer Segments</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {segments.map((seg) => (
              <div key={seg.segment} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{seg.segment}</span>
                <span style={{ background: "#3b82f6", padding: "4px 12px", borderRadius: 20, fontSize: "0.85rem" }}>
                  {seg.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance Table */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "1.1rem" }}>Category Performance</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8" }}>Category</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8" }}>Sales</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8" }}>Profit</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8" }}>Orders</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8" }}>Margin</th>
                </tr>
              </thead>
              <tbody>
                {categoryPerformance.map((cat) => (
                  <tr key={cat.category} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "12px" }}>{cat.category}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>${cat.sales.toLocaleString()}</td>
                    <td style={{ padding: "12px", textAlign: "right", color: cat.profit >= 0 ? "#22c55e" : "#ef4444" }}>
                      ${cat.profit.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{cat.orders.toLocaleString()}</td>
                    <td style={{ padding: "12px", textAlign: "right", color: cat.margin >= 10 ? "#22c55e" : "#f59e0b" }}>
                      {cat.margin}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Regional Performance and Top States */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Regional Performance */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "1.1rem" }}>Regional Performance</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8" }}>Region</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8" }}>Customers</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8" }}>Sales</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8" }}>Profit</th>
                </tr>
              </thead>
              <tbody>
                {regionPerformance.map((reg) => (
                  <tr key={reg.region} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "12px" }}>{reg.region}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{reg.customers.toLocaleString()}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>${reg.sales.toLocaleString()}</td>
                    <td style={{ padding: "12px", textAlign: "right", color: reg.profit >= 0 ? "#22c55e" : "#ef4444" }}>
                      ${reg.profit.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top States */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "1.1rem" }}>Top 5 States by Sales</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8" }}>State</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8" }}>Sales</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8" }}>Profit</th>
                </tr>
              </thead>
              <tbody>
                {topStates.map((state) => (
                  <tr key={state.state} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "12px" }}>{state.state}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>${state.sales.toLocaleString()}</td>
                    <td style={{ padding: "12px", textAlign: "right", color: state.profit >= 0 ? "#22c55e" : "#ef4444" }}>
                      ${state.profit.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

