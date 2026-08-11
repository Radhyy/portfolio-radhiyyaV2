import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_zYrR9aju0vNs@ep-twilight-haze-axghs3o4.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    const body = await request.json();
    const { title, file_url, type } = body;

    await client.connect();

    const updateQuery = `
      UPDATE certificates 
      SET title = $1, file_url = $2, type = $3
      WHERE original_id = $4
      RETURNING *
    `;
    
    const values = [title, file_url, type || 'image', parseInt(id)];
    const result = await client.query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, certificate: result.rows[0] });
  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_zYrR9aju0vNs@ep-twilight-haze-axghs3o4.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const deleteQuery = 'DELETE FROM certificates WHERE original_id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [parseInt(id)]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  } finally {
    await client.end();
  }
}
