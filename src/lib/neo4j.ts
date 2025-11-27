import neo4j, { type Driver } from "neo4j-driver";

declare global {
  // eslint-disable-next-line no-var
  var _neo4jDriver: Driver | undefined;
}

function createDriver(): Driver {
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;

  if (!uri || !username || !password) {
    throw new Error("Missing Neo4j connection env vars");
  }

  return neo4j.driver(uri, neo4j.auth.basic(username, password));
}

export function getDriver(): Driver {
  if (!global._neo4jDriver) {
    global._neo4jDriver = createDriver();
  }
  return global._neo4jDriver;
}

export function getSession() {
  const database = process.env.NEO4J_DATABASE || "neo4j";
  return getDriver().session({ database });
}
