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
    const { title, description, type, image_url, detail_image_url, gallery_images, tags, collaborator_ids } = body;

    await client.connect();

    const updateQuery = `
      UPDATE projects 
      SET title = $1, description = $2, type = $3, image_url = $4, detail_image_url = $5, gallery_images = $6, tags = $7
      WHERE original_id = $8
      RETURNING *
    `;
    
    const values = [
      title, 
      description, 
      type, 
      image_url || null, 
      detail_image_url || null, 
      JSON.stringify(gallery_images || []),
      JSON.stringify(tags || []),
      parseInt(id)
    ];

    const result = await client.query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update collaborators: first delete existing ones for this project
    await client.query('DELETE FROM project_collaborators WHERE project_id = $1', [parseInt(id)]);

    // Insert updated collaborator IDs if provided
    if (Array.isArray(collaborator_ids) && collaborator_ids.length > 0) {
      for (const colId of collaborator_ids) {
        await client.query(
          'INSERT INTO project_collaborators (project_id, collaborator_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [parseInt(id), colId]
        );
      }
    }

    return NextResponse.json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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

    const deleteQuery = 'DELETE FROM projects WHERE original_id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [parseInt(id)]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  } finally {
    await client.end();
  }
}
