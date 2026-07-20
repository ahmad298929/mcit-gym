// service-worker.js
// يخزّن هيكل التطبيق (App Shell) للعمل دون اتصال، ولا يتدخل أبدًا في طلبات Supabase (يجب أن تبقى حية دائمًا)

const CACHE_VERSION = 'fitness-dashboard-v2-auth';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function isSupabaseOrApi(url) {
  return url.hostname.endsWith('supabase.co') || url.pathname.startsWith('/api/');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // لا نتدخل في طلبات الكتابة (POST/PATCH إلخ) أبدًا

  const url = new URL(req.url);

  // لا تخزّني مؤقتًا أي طلب متعلق بقاعدة البيانات — يجب أن تصل دائمًا للشبكة مباشرة
  if (isSupabaseOrApi(url)) {
    event.respondWith(fetch(req).catch(() => new Response(null, { status: 503 })));
    return;
  }

  // خطوط جوجل ومكتبة الرسوم البيانية: شبكة أولًا مع تخزين احتياطي
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // ملفات التطبيق نفسها: من الكاش أولًا لسرعة الفتح، ثم تحديث في الخلفية
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
