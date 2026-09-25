import { NextResponse } from 'next/server';
import { Client } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || '';

export async function GET() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM collaborators ORDER BY id DESC');
    return NextResponse.json({ collaborators: result.rows });
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return NextResponse.json({ error: 'Failed to fetch collaborators' }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function POST(request: Request) {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const body = await request.json();
    const { name, avatar_url, portfolio_url } = body;

    if (!name || !avatar_url) {
      return NextResponse.json({ error: 'Nama dan foto profile wajib diisi' }, { status: 400 });
    }

    await client.connect();

    const insertQuery = `
      INSERT INTO collaborators (name, avatar_url, portfolio_url)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [name, avatar_url, portfolio_url || null]);

    return NextResponse.json({ success: true, collaborator: result.rows[0] });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    return NextResponse.json({ error: 'Failed to add collaborator' }, { status: 500 });
  } finally {
    await client.end();
  }
}
