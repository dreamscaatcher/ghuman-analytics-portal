const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
};

const pillStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(120, 186, 255, 0.12)",
  border: "1px solid rgba(120, 186, 255, 0.35)",
  color: "#b9ddff",
  fontWeight: 700,
  letterSpacing: "0.02em",
};

const sectionTitleStyle = {
  fontSize: "1.6rem",
  letterSpacing: "-0.02em",
  margin: "0 0 10px",
};

const textStyle = { margin: 0, color: "#c8d2e3", lineHeight: 1.6 };

const pillars = [
  {
    title: "Cypher-first analytics",
    body: "ROAS, LTV, and uplift computed in Neo4j with channel, cohort, and experiment dimensions.",
  },
  {
    title: "Geo intelligence",
    body: "GeoCell catchments and cannibalization overlays mapped to stores and campaigns.",
  },
  {
    title: "Influence graph",
    body: "Referrals and communities surfaced with graph algorithms for advocacy targeting.",
  },
  {
    title: "BI storytelling",
    body: "Power BI pages for performance, cohorts, geo, experiments, and influence.",
  },
];

const deliverables = [
  { name: "Neo4j dataset + Cypher views", detail: "Saved queries for ROAS, cohorts, churn, uplift, influence." },
  { name: "Power BI report", detail: "Embed-ready PBIX + PDF export for LinkedIn and ghuman.online." },
  { name: "Insights Portal", detail: "Next.js page hosting the story, embeds, and geo overlays." },
  { name: "Automation", detail: "Python loader scripts + test harness for Neo4j connection." },
];

const cypherSnippet = `// Channel performance and ROAS
MATCH (camp:Campaign)-[:USES]->(ch:Channel)
OPTIONAL MATCH (cust:Customer)-[o:ORDERED]->(ord:Order)-[:FROM]->(camp)
WITH ch.name AS channel, camp.name AS campaign,
     sum(o.spend) AS spend, sum(ord.value) AS revenue
RETURN channel, campaign, spend, revenue,
       CASE WHEN spend = 0 THEN 0 ELSE revenue / spend END AS roas
ORDER BY roas DESC`;

const flow = [
  {
    title: "Ingest",
    body: "Python ETL loads CSVs to Neo4j (customers, campaigns, impressions, clicks, orders, stores, GeoCells).",
  },
  {
    title: "Model",
    body: "Constraints + projections; derive NEAR, LOCATED_IN, REFERRED, and ABTest variant relationships.",
  },
  {
    title: "Analyze",
    body: "Cypher/graph algorithms for ROAS, LTV, churn, influence, and cannibalization heatmaps.",
  },
  {
    title: "Serve",
    body: "Exported tables to Power BI and GeoJSON overlays surfaced through the Next.js Insights Portal.",
  },
];

export default function Page() {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "48px 20px 96px",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <header style={{ display: "grid", gap: 18 }}>
        <div style={pillStyle}>
          <span style={{ width: 10, height: 10, background: "#7bd88f", borderRadius: "50%", display: "inline-block" }} aria-hidden="true" />
          ghuman.online · Marketing Analytics & Neo4j
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          <h1 style={{ fontSize: "2.8rem", margin: 0, letterSpacing: "-0.03em" }}>
            Full-funnel marketing analytics with Cypher, Power BI, and a graph-native geo layer.
          </h1>
          <p style={{ ...textStyle, fontSize: "1.05rem" }}>
            This portal replaces the restaurant landing page with the new analytics case study: Neo4j-backed KPIs, BI
            storytelling, and geospatial targeting. It is built for LinkedIn, clients, and recruiters to explore the
            project live on ghuman.online.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a
              href="https://github.com/"
              style={{
                ...pillStyle,
                textDecoration: "none",
                background: "linear-gradient(135deg, #3b82f6, #22c55e)",
                color: "#0a0f1a",
                border: "none",
                boxShadow: "0 12px 30px rgba(59,130,246,0.35)",
              }}
            >
              View repo (Neo4j + BI)
            </a>
            <a
              href="#neo4j"
              style={{
                ...pillStyle,
                textDecoration: "none",
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.18)",
                color: "#e8edf5",
              }}
            >
              Connection details
            </a>
          </div>
        </div>
      </header>

      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={sectionTitleStyle}>Project pillars</h2>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {pillars.map((item) => (
            <article key={item.title} style={cardStyle}>
              <h3 style={{ margin: "0 0 8px", letterSpacing: "-0.01em" }}>{item.title}</h3>
              <p style={textStyle}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={sectionTitleStyle}>Cypher analytics</h2>
        <div style={{ ...cardStyle, display: "grid", gap: 10 }}>
          <p style={textStyle}>
            Saved queries cover ROAS, CAC, CTR/CVR, cohorts, LTV, churn, uplift tests, referral influence, geo
            catchments, and cannibalization. Exports feed Power BI and the map overlays.
          </p>
          <pre
            style={{
              background: "#0f172a",
              borderRadius: 12,
              padding: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#d1e9ff",
              overflowX: "auto",
              fontSize: "0.95rem",
            }}
          >
{cypherSnippet}
          </pre>
        </div>
      </section>

      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={sectionTitleStyle}>Data flow</h2>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {flow.map((item) => (
            <article key={item.title} style={cardStyle}>
              <h3 style={{ margin: "0 0 8px", letterSpacing: "-0.01em" }}>{item.title}</h3>
              <p style={textStyle}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 16 }}>
        <h2 style={sectionTitleStyle}>Deliverables for ghuman.online</h2>
        <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 8 }}>
            {deliverables.map((item) => (
              <div key={item.name} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    marginTop: 7,
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 0 6px rgba(34, 197, 94, 0.15)",
                  }}
                  aria-hidden="true"
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{item.name}</div>
                  <div style={{ ...textStyle, fontSize: "0.97rem" }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 8,
              padding: 14,
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(14,165,233,0.2))",
              border: "1px solid rgba(59,130,246,0.35)",
              color: "#eaf4ff",
            }}
          >
            Power BI embeds and map tiles are placeholders until the Neo4j exports are pushed. Replace the repo link
            above with the new Git URL once published.
          </div>
        </div>
      </section>

      <section id="neo4j" style={{ display: "grid", gap: 16 }}>
        <h2 style={sectionTitleStyle}>Neo4j connection</h2>
        <div style={{ ...cardStyle, display: "grid", gap: 10 }}>
          <p style={textStyle}>
            Set environment variables in <code>.env.local</code> and run <code>npm run test:neo4j</code> to validate the
            Aura/Neo4j connection.
          </p>
          <div
            style={{
              display: "grid",
              gap: 6,
              fontFamily: "ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              background: "#0f172a",
              padding: 12,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>NEO4J_URI=bolt+s://YOUR_URI</div>
            <div>NEO4J_USERNAME=neo4j</div>
            <div>NEO4J_PASSWORD=your_password</div>
            <div>NEO4J_DATABASE=neo4j</div>
          </div>
          <p style={{ ...textStyle, marginTop: 4 }}>
            The shared driver utility (<code>src/lib/neo4j.ts</code>) is ready for API routes or server components to
            execute Cypher and stream results into the portal.
          </p>
        </div>
      </section>
    </div>
  );
}
