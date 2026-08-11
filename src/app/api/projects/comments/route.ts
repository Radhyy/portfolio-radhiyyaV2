import { NextResponse } from 'next/server';
import { Client } from 'pg';

const DATABASE_URL = 'postgresql://neondb_owner:npg_zYrR9aju0vNs@ep-twilight-haze-axghs3o4.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query(
      'SELECT * FROM project_comments WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );

    return NextResponse.json({ comments: result.rows });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
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
    const { projectId, name, content } = body;

    if (!projectId || !name || !content || name.trim() === '' || content.trim() === '') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    await client.connect();

    const result = await client.query(
      'INSERT INTO project_comments (project_id, name, content) VALUES ($1, $2, $3) RETURNING *',
      [projectId, name.trim(), content.trim()]
    );

    return NextResponse.json({ success: true, comment: result.rows[0] });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  } finally {
    await client.end();
  }
}
