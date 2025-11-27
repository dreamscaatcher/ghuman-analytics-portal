import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { getSession } from "../../../lib/neo4j";

type RequestBody = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!name || !email || !password || password.length < 8) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const session = getSession();

  try {
    // Check for existing user by email
    const existing = await session.run("MATCH (u:User {email: $email}) RETURN u LIMIT 1", { email });
    if (existing.records.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await session.run(
      `
        CREATE (u:User {
          id: $id,
          name: $name,
          email: $email,
          passwordHash: $passwordHash,
          createdAt: datetime()
        })
      `,
      {
        id: randomUUID(),
        name,
        email,
        passwordHash,
      },
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  } finally {
    await session.close();
  }
}
