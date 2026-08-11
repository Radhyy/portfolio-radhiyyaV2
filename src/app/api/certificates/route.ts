import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_zYrR9aju0vNs@ep-twilight-haze-axghs3o4.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const result = await client.query('SELECT * FROM certificates ORDER BY original_id ASC');
    
    const certificates = result.rows.map(row => {
      let url = row.file_url;
      // Only wrap with proxy if it's an ImgBB image URL
      if (row.type === 'image' && url.includes('i.ibb.co')) {
        url = `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
      }
      return {
        ...row,
        file_url: url
      };
    });
    
    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function POST(request: Request) {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_zYrR9aju0vNs@ep-twilight-haze-axghs3o4.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    const body = await request.json();
    const { title, file_url, type } = body;

    await client.connect();

    // Get the highest original_id to increment it
    const maxIdResult = await client.query('SELECT MAX(original_id) as max_id FROM certificates');
    const newOriginalId = (maxIdResult.rows[0].max_id || 0) + 1;

    const insertQuery = `
      INSERT INTO certificates (original_id, title, file_url, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [newOriginalId, title, file_url, type || 'image'];
    const result = await client.query(insertQuery, values);

    return NextResponse.json({ success: true, certificate: result.rows[0] });
  } catch (error) {
    console.error('Error inserting certificate:', error);
    return NextResponse.json({ error: 'Failed to insert certificate' }, { status: 500 });
  } finally {
    await client.end();
  }
}
