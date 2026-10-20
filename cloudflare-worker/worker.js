/**
 * Cloudflare Worker - API Gateway & Proxy untuk Google Apps Script
 * Sistem: Jurnal Digital 7 Kebiasaan Anak Indonesia Hebat
 */

export default {
  async fetch(request, env, ctx) {
    // 1. Tangani Preflight CORS
    if (request.method === 'OPTIONS') {
      return handleCorsPreflight(request, env);
    }

    const url = new URL(request.url);

    // 2. Filter hanya path /api/*
    if (!url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Endpoint tidak ditemukan' }), {
        status: 404,
        headers: getCorsHeaders(env)
      });
    }

    // 3. Persiapkan request forwarding ke Google Apps Script Web App
    const gasUrl = env.GOOGLE_APPS_SCRIPT_URL;
    if (!gasUrl) {
      return new Response(JSON.stringify({ error: 'GOOGLE_APPS_SCRIPT_URL belum dikonfigurasi' }), {
        status: 500,
        headers: getCorsHeaders(env)
      });
    }

    try {
      const bodyText = (request.method === 'POST' || request.method === 'PUT') ? await request.text() : null;
      const timestamp = Date.now().toString();

      // Buat HMAC signature sederhana untuk validasi di Google Apps Script
      const secret = env.WORKER_SECRET || 'default_secret';
      const signature = await generateHmac(bodyText || url.search, secret);

      // Teruskan ke Google Apps Script
      // CATATAN KRITIS: Google Apps Script melakukan HTTP 302 Redirect ke script.googleusercontent.com
      // Opsi redirect: 'follow' wajib diaktifkan agar Worker menangani redirect secara transparan.
      const forwardUrl = new URL(gasUrl);
      forwardUrl.searchParams.set('path', url.pathname);
      forwardUrl.searchParams.set('ts', timestamp);

      const forwardHeaders = new Headers();
      forwardHeaders.set('Content-Type', 'application/json');
      forwardHeaders.set('X-Worker-Signature', signature);
      forwardHeaders.set('X-Worker-Timestamp', timestamp);
      
      const authHeader = request.headers.get('Authorization');
      if (authHeader) {
        forwardHeaders.set('Authorization', authHeader);
      }

      const responseFromGas = await fetch(forwardUrl.toString(), {
        method: request.method === 'GET' ? 'GET' : 'POST',
        headers: forwardHeaders,
        body: bodyText,
        redirect: 'follow' // Wajib untuk mengikuti 302 Apps Script
      });

      const responseBody = await responseFromGas.text();

      return new Response(responseBody, {
        status: responseFromGas.status,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env)
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'GATEWAY_ERROR',
          message: 'Gagal menghubungi backend Google Apps Script: ' + err.message
        }
      }), {
        status: 502,
        headers: getCorsHeaders(env)
      });
    }
  }
};

function getCorsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env?.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Version',
    'Access-Control-Max-Age': '86400'
  };
}

function handleCorsPreflight(request, env) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(env)
  });
}

async function generateHmac(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message || ''));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}
