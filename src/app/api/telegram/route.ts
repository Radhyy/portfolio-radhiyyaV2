import { NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import FormData from 'form-data';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// 1. Setup Environment
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '';
const DATABASE_URL = process.env.DATABASE_URL || '';

const groqKeys = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY_4,
  process.env.GROQ_API_KEY_5,
  process.env.GROQ_API_KEY_6,
].filter(Boolean) as string[];

let currentGroqIndex = 0;
function getNextGroqKey() {
  if (groqKeys.length === 0) return '';
  const key = groqKeys[currentGroqIndex];
  currentGroqIndex = (currentGroqIndex + 1) % groqKeys.length;
  return key;
}

// 2. Initialize Bot and Database
const bot = new Telegraf(TELEGRAM_TOKEN);
const db = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
});

db.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

// State management (Note: On Serverless like Netlify, in-memory state resets between requests. 
// For production, these should be moved to a DB table or Redis).
let pendingActions = new Map<number, any>();
let chatHistory = new Map<number, any[]>(); 
const MEMORY_FILE = path.join(process.cwd(), 'bot_memory.json'); 

// Helper: Long-term memory
function getLongTermMemory() {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const data = fs.readFileSync(MEMORY_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading memory:", err);
  }
  return [];
}

function addLongTermMemory(rule: string) {
  const memory = getLongTermMemory();
  memory.push(rule);
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
  } catch (e) {
    console.error("Failed to write memory file. If on Netlify, disk is read-only.", e);
  }
}

// Helper: Short-term memory
function updateChatHistory(chatId: number, role: string, content: string) {
  if (!chatHistory.has(chatId)) chatHistory.set(chatId, []);
  const history = chatHistory.get(chatId)!;
  history.push({ role, content });
  if (history.length > 6) history.shift();
}

// Helper to get DB Context
async function getDBContext() {
  try {
    const colabs = await db.query('SELECT id, name FROM collaborators');
    const projs = await db.query('SELECT original_id, title FROM projects');
    const recentProjs = await db.query('SELECT original_id, title, description FROM projects ORDER BY original_id DESC LIMIT 2');
    
    return {
      collaborators: colabs.rows,
      projects: projs.rows,
      recentProjects: recentProjs.rows
    };
  } catch (error) {
    console.error("Error fetching context:", error);
    return { collaborators: [], projects: [], recentProjects: [] };
  }
}

// Helper to ask Groq
async function askGroq(chatId: number, prompt: string, base64Image: string | null = null) {
  const apiKey = getNextGroqKey();
  const context = await getDBContext();
  const learnedRules = getLongTermMemory();
  
  const colabString = context.collaborators.map(c => `[ID: ${c.id}, Nama: ${c.name}]`).join(', ');
  const projString = context.projects.map(p => `[ID: ${p.original_id}, Judul: ${p.title}]`).join(', ');
  
  let refDesc = '';
  if (context.recentProjects && context.recentProjects.length > 0) {
    refDesc = context.recentProjects.map(p => `Judul: ${p.title}\nDeskripsi: ${p.description}`).join('\n\n');
  }

  const systemPrompt = `Kamu adalah Asisten AI canggih untuk mengelola portofolio IT. Kamu memiliki kemampuan untuk merespons revisi dan mempelajari instruksi baru.
  
DATA TERSEDIA DI DATABASE SAAT INI:
- Collaborators: ${colabString || 'Kosong'}
- Projects: ${projString || 'Kosong'}

CONTOH GAYA PENULISAN DESKRIPSI (DARI DATABASE):
${refDesc || 'Belum ada contoh. Gunakan poin-poin dan teks tebal (Markdown) untuk poin penting.'}

ATURAN TAMBAHAN (HASIL BELAJAR DARI USER):
${learnedRules.length > 0 ? learnedRules.map((r: string, i: number) => `${i+1}. ${r}`).join('\n') : '- Belum ada aturan tambahan.'}

TUGAS UTAMA: 
Analisis input user (beserta riwayat chat) dan klasifikasikan niatnya ke format JSON. 
HANYA KEMBALIKAN RAW JSON, TANPA MARKDOWN. WAJIB menggunakan struktur JSON dengan properti "action".

PILIHAN ACTION:
1. "chat": Jika user ngobrol, bertanya, atau merevisi draf. Kembalikan: {"action": "chat", "reply": "Jawaban natural kamu..."}
2. "learn": Jika user memberikan KOREKSI CARA KERJAMU, ATURAN BARU, atau KELUHAN. Kembalikan: {"action": "learn", "data": {"rule": "Aturan baru..."}}
3. "create_project": Jika user memberikan detail/gambar project. Kembalikan: {"action": "create_project", "data": {"title": "...", "description": "...", "techStack": ["..."], "collaborator_ids": [1, 2]}}. 
   *PENTING 1*: Jika user menyebut nama collaborator yang ada, cantumkan ID-nya di collaborator_ids.
   *PENTING 2*: Jika user hanya menyebut 1 teknologi, lengkapi ekosistemnya secara logis (misal: Next.js -> Tailwind, dll).
4. "create_certificate": {"action": "create_certificate", "data": {"title": "...", "description": "..."}}
5. "create_collaborator": {"action": "create_collaborator", "data": {"name": "...", "portfolio_url": "..."}}
6. "delete_project" / "delete_collaborator": {"action": "delete_project", "data": {"id": 1, "title": "Nama"}}
`;

  const messages: any[] = [{ role: 'system', content: systemPrompt }];
  
  const history = chatHistory.get(chatId) || [];
  history.forEach(msg => {
    messages.push({ role: msg.role, content: msg.content });
  });

  let userContent: any[] = [];
  if (prompt) userContent.push({ type: 'text', text: prompt });
  if (base64Image) {
    userContent.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${base64Image}` }
    });
  }
  messages.push({ role: 'user', content: userContent });

  const model = base64Image ? 'qwen/qwen3.8-27b' : 'openai/gpt-oss-120b';

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: model,
      messages: messages,
      temperature: 0.3,
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    let aiResponse = response.data.choices[0].message.content;
    console.log("AI Raw Output:", aiResponse);
    aiResponse = aiResponse.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
    
    updateChatHistory(chatId, 'user', prompt || '[Gambar Dikirim]');
    
    return JSON.parse(aiResponse);
  } catch (error: any) {
    console.error("Groq API Error:", error?.response?.data || error.message);
    throw new Error('Gagal memproses dengan AI saat ini.');
  }
}

async function uploadToImgBB(base64Image: string) {
  const form = new FormData();
  form.append('key', IMGBB_API_KEY);
  form.append('image', base64Image);
  const res = await axios.post('https://api.imgbb.com/1/upload', form, { headers: form.getHeaders() });
  return res.data.data.url;
}

// 3. Handle Messages
bot.on('message', async (ctx: any) => {
  const chatId = ctx.chat.id;
  const message = ctx.message;
  const text = message.caption || message.text || '';
  
  if (text.toLowerCase() === 'oke' || text.toLowerCase() === 'udah oke' || text.toLowerCase() === 'ya') {
    const pending = pendingActions.get(chatId);
    if (!pending) {
       updateChatHistory(chatId, 'user', text);
       return ctx.reply('Tidak ada perintah yang menunggu konfirmasi.');
    }
    
    ctx.reply('⏳ Memproses permintaan ke database...');
    try {
      const { draft, tgFileId } = pending;
      let imageUrl = null;
      
      if (tgFileId && !draft.action.startsWith('delete') && !draft.action.startsWith('learn')) {
        const fileLink = await ctx.telegram.getFileLink(tgFileId);
        const imageBuffer = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(imageBuffer.data).toString('base64');
        imageUrl = await uploadToImgBB(base64Image);
      }

      if (draft.action === 'create_project') {
        const d = draft.data;
        const maxIdResult = await db.query('SELECT MAX(original_id) as max_id FROM projects');
        const newOriginalId = (maxIdResult.rows[0].max_id || 0) + 1;
        await db.query(
          `INSERT INTO projects (title, description, type, image_url, detail_image_url, gallery_images, tags, original_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [d.title || 'Untitled', d.description || '', 'normal', imageUrl || '', '', JSON.stringify([]), JSON.stringify(d.techStack || []), newOriginalId]
        );
        
        if (d.collaborator_ids && d.collaborator_ids.length > 0) {
          for (const colId of d.collaborator_ids) {
            await db.query(
              'INSERT INTO project_collaborators (project_id, collaborator_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
              [newOriginalId, colId]
            );
          }
        }
        ctx.reply(`✅ Project ${d.title} beserta kolaborator berhasil ditambahkan!`);
      
      } else if (draft.action === 'create_certificate') {
        const d = draft.data;
        const maxIdResult = await db.query('SELECT MAX(original_id) as max_id FROM certificates');
        const newOriginalId = (maxIdResult.rows[0].max_id || 0) + 1;
        await db.query(
          `INSERT INTO certificates (title, file_url, type, original_id) VALUES ($1, $2, $3, $4)`,
          [d.title || 'Untitled', imageUrl || '', 'image', newOriginalId]
        );
        ctx.reply(`✅ Sertifikat ${d.title} berhasil ditambahkan!`);
      
      } else if (draft.action === 'create_collaborator') {
        const d = draft.data;
        await db.query(
          `INSERT INTO collaborators (name, avatar_url, portfolio_url) VALUES ($1, $2, $3)`,
          [d.name || 'Unknown', imageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(d.name || 'Unknown'), d.portfolio_url || '']
        );
        ctx.reply(`✅ Kolaborator ${d.name} berhasil ditambahkan!`);
      
      } else if (draft.action === 'delete_project') {
        await db.query(`DELETE FROM project_collaborators WHERE project_id = $1`, [draft.data.id]);
        await db.query(`DELETE FROM projects WHERE original_id = $1`, [draft.data.id]);
        ctx.reply(`🗑️ Project ${draft.data.title} berhasil dihapus!`);
      
      } else if (draft.action === 'delete_collaborator') {
        await db.query(`DELETE FROM project_collaborators WHERE collaborator_id = $1`, [draft.data.id]);
        await db.query(`DELETE FROM collaborators WHERE id = $1`, [draft.data.id]);
        ctx.reply(`🗑️ Kolaborator berhasil dihapus!`);
      }

      pendingActions.delete(chatId);
      updateChatHistory(chatId, 'assistant', '✅ Permintaan berhasil dieksekusi.');
    } catch (error) {
      console.error(error);
      ctx.reply('❌ Terjadi kesalahan saat mengeksekusi database.');
      updateChatHistory(chatId, 'assistant', '❌ Terjadi kesalahan saat mengeksekusi database.');
    }
    return;
  }
  
  if (text.toLowerCase() === 'batal') {
    pendingActions.delete(chatId);
    updateChatHistory(chatId, 'user', 'Batal');
    updateChatHistory(chatId, 'assistant', 'Proses dibatalkan.');
    return ctx.reply('❌ Dibatalkan.');
  }

  if (!text && !message.photo) return;

  try {
    ctx.reply('🤖 Sebentar ya...');
    let base64Image = null;
    let tgFileId = null;

    if (message.photo && message.photo.length > 0) {
      const photo = message.photo[message.photo.length - 1];
      tgFileId = photo.file_id;
      const fileLink = await ctx.telegram.getFileLink(tgFileId);
      const imageBuffer = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
      base64Image = Buffer.from(imageBuffer.data).toString('base64');
    }

    const aiResult = await askGroq(chatId, text, base64Image);
    
    if (aiResult.action === 'chat') {
      updateChatHistory(chatId, 'assistant', aiResult.reply || 'Saya tidak mengerti maksudmu.');
      return ctx.reply(aiResult.reply || 'Saya tidak mengerti maksudmu.');
    }

    if (aiResult.action === 'learn') {
      const newRule = aiResult.data.rule;
      addLongTermMemory(newRule);
      const replyText = `🧠 Saya telah belajar aturan baru selamanya:\n"${newRule}"`;
      updateChatHistory(chatId, 'assistant', replyText);
      return ctx.reply(replyText);
    }
    
    pendingActions.set(chatId, { draft: aiResult, tgFileId });

    let confirmMsg = `📝 KONFIRMASI TINDAKAN:\n\n`;
    if (aiResult.action === 'delete_project') {
      confirmMsg += `⚠️ Kamu akan menghapus Project: ${aiResult.data.title}\n`;
    } else if (aiResult.action === 'delete_collaborator') {
      confirmMsg += `⚠️ Kamu akan menghapus Collaborator dengan ID: ${aiResult.data.id}\n`;
    } else {
      confirmMsg += `📌 Aksi: ${aiResult.action}\n`;
      if (aiResult.data.title) confirmMsg += `🏷️ Judul: ${aiResult.data.title}\n`;
      if (aiResult.data.name) confirmMsg += `🧑 Nama: ${aiResult.data.name}\n`;
      if (aiResult.data.portfolio_url) confirmMsg += `🔗 URL Portfolio: ${aiResult.data.portfolio_url}\n`;
      if (aiResult.data.description) confirmMsg += `📝 Deskripsi: ${aiResult.data.description.substring(0, 100)}...\n`;
      if (aiResult.data.techStack) confirmMsg += `💻 Tech: ${aiResult.data.techStack.join(', ')}\n`;
      if (aiResult.data.collaborator_ids) confirmMsg += `🤝 ID Kolaborator: ${aiResult.data.collaborator_ids.join(', ')}\n`;
    }
    
    confirmMsg += `\nApakah sudah benar? Balas dengan "Oke" untuk eksekusi, atau revisi langsung dengan mengetik keluhanmu.`;
    
    updateChatHistory(chatId, 'assistant', confirmMsg);
    ctx.reply(confirmMsg);
    
  } catch (error) {
    console.error(error);
    ctx.reply('❌ Maaf, AI sedang pusing atau gagal memproses pesanmu.');
  }
});

// Endpoint POST untuk menerima Webhook dari Telegram
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Endpoint GET untuk mendaftarkan Webhook secara manual
export async function GET(req: Request) {
  const url = new URL(req.url);
  // Kamu harus mengubah ini sesuai dengan domain produksi/Netlify kamu!
  const host = url.origin;
  const webhookUrl = `${host}/api/telegram`;
  
  try {
    await bot.telegram.setWebhook(webhookUrl);
    return NextResponse.json({ message: `✅ Webhook berhasil diatur ke: ${webhookUrl}` });
  } catch (error) {
    console.error('Setup webhook error:', error);
    return NextResponse.json({ error: 'Gagal mengatur webhook' }, { status: 500 });
  }
}
