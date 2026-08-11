import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(request: Request) {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_zYrR9aju0vNs@ep-twilight-haze-axghs3o4.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    const body = await request.json();
    const { projectId, emoji, action } = body;

    if (!projectId || !emoji || !['add', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    await client.connect();

    // Fetch current reactions
    const result = await client.query('SELECT reactions FROM projects WHERE original_id = $1', [projectId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    let reactions = result.rows[0].reactions || {};
    let currentCount = reactions[emoji] || 0;

    if (action === 'add') {
      currentCount += 1;
    } else if (action === 'remove') {
      currentCount = Math.max(0, currentCount - 1);
    }

    if (currentCount === 0) {
      delete reactions[emoji];
    } else {
      reactions[emoji] = currentCount;
    }

    // Update table
    await client.query('UPDATE projects SET reactions = $1 WHERE original_id = $2', [JSON.stringify(reactions), projectId]);

    return NextResponse.json({ success: true, reactions });
  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json({ error: 'Failed to update reaction' }, { status: 500 });
  } finally {
    await client.end();
  }
}
