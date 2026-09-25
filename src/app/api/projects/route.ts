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
    
    const result = await client.query(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM project_comments c WHERE c.project_id = p.original_id) AS comment_count,
        COALESCE(
          (SELECT json_agg(json_build_object('id', col.id, 'name', col.name, 'avatar_url', col.avatar_url, 'portfolio_url', col.portfolio_url))
           FROM project_collaborators pc
           JOIN collaborators col ON pc.collaborator_id = col.id
           WHERE pc.project_id = p.original_id), '[]'::json
        ) AS collaborators
      FROM projects p 
      ORDER BY p.original_id ASC
    `);
    
    const projects: any[] = [];
    const cloudProjects: any[] = [];

    result.rows.forEach(row => {
      const rawGallery: string[] = Array.isArray(row.gallery_images) ? row.gallery_images : [];
      const gallery_images = rawGallery.map((url: string) => 
        url.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(url)}` : url
      );

      const project: any = {
        id: row.original_id,
        title: row.title,
        description: row.description,
        image: row.image_url ? `https://wsrv.nl/?url=${encodeURIComponent(row.image_url)}` : null,
        detailImage: row.detail_image_url ? `https://wsrv.nl/?url=${encodeURIComponent(row.detail_image_url)}` : null,
        gallery_images,
        tags: row.tags,
        reactions: row.reactions || {},
        commentCount: parseInt(row.comment_count) || 0,
        collaborators: row.collaborators || [],
      };

      if (row.type === 'normal') {
        projects.push(project);
      } else if (row.type === 'cloud') {
        cloudProjects.push(project);
      }
    });

    return NextResponse.json({ projects, cloudProjects });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
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
    const { title, description, type, image_url, detail_image_url, gallery_images, tags, collaborator_ids } = body;

    await client.connect();

    // Get the highest original_id to increment it
    const maxIdResult = await client.query('SELECT MAX(original_id) as max_id FROM projects');
    const newOriginalId = (maxIdResult.rows[0].max_id || 0) + 1;

    const insertQuery = `
      INSERT INTO projects (title, description, type, image_url, detail_image_url, gallery_images, tags, original_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
      newOriginalId
    ];

    const result = await client.query(insertQuery, values);

    // Insert collaborators if any provided
    if (Array.isArray(collaborator_ids) && collaborator_ids.length > 0) {
      for (const colId of collaborator_ids) {
        await client.query(
          'INSERT INTO project_collaborators (project_id, collaborator_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [newOriginalId, colId]
        );
      }
    }

    return NextResponse.json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error('Error inserting project:', error);
    return NextResponse.json({ error: 'Failed to insert project' }, { status: 500 });
  } finally {
    await client.end();
  }
}
