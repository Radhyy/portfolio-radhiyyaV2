import { NextResponse } from 'next/server';
import { Client } from 'pg';

const DATABASE_URL = 'postgresql://neondb_owner:npg_zYrR9aju0vNs@ep-twilight-haze-axghs3o4.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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

    const updateQuery = `
      UPDATE collaborators
      SET name = $1, avatar_url = $2, portfolio_url = $3
      WHERE id = $4
      RETURNING *
    `;

    const result = await client.query(updateQuery, [name, avatar_url, portfolio_url || null, parseInt(id)]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Collaborator not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, collaborator: result.rows[0] });
  } catch (error) {
    console.error('Error updating collaborator:', error);
    return NextResponse.json({ error: 'Failed to update collaborator' }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const deleteQuery = 'DELETE FROM collaborators WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [parseInt(id)]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Collaborator not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collaborator:', error);
    return NextResponse.json({ error: 'Failed to delete collaborator' }, { status: 500 });
  } finally {
    await client.end();
  }
}
