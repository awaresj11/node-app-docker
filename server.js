import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

// Security headers (no extra dependency needed)
app.use((_req, res, next) => {
  res.set({
    'Content-Security-Policy': [
      "default-src 'self'",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com",
      "img-src 'self' data:",
      "script-src 'self'",
      "connect-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });
  next();
});

app.get('/healthz', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Tiny in-memory rate limit for the contact endpoint
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
};

app.post('/api/contact', (req, res) => {
  if (limited(req.ip)) return res.status(429).json({ error: 'Too many messages. Try again in a minute.' });
  const { name = '', email = '', message = '' } = req.body ?? {};
  const valid =
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    message.trim().length >= 10;
  if (!valid) return res.status(400).json({ error: 'Add your name, a valid email, and a message of at least 10 characters.' });

  // Hook up SES / SNS / your mailer here.
  console.log('[contact]', { name: name.trim(), email: email.trim(), message: message.trim() });
  res.status(201).json({ ok: true });
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d', etag: true }));

app.use((_req, res) => res.status(404).sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Portfolio running on http://localhost:${PORT}`));
