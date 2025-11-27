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
    const id = randomUUID();

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
      { id, name, email, passwordHash },
    );

    const response = NextResponse.json({ ok: true, user: { id, name, email } });
    response.cookies.set("registered", id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  } finally {
    await session.close();
  }
}
