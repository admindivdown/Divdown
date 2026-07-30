/* ===== UPDATE CACHE VERSION ===== */
const CACHE_VERSION = "13";
const CACHE = `divdown-v${CACHE_VERSION}`;

/* ===== END UPDATE CACHE VERSION ===== */ 
const FILES=["/","/index.html","/style.css","/menu.css","/tampilan_bahasa.css","/bahasa.js","/app.js","/assets/logo.webp","/assets/install-logo.webp","/assets/instal.webp"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))); self.skipWaiting() }); self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.map(i=>i!==CACHE&&caches.delete(i))))); self.clients.claim() }); self.addEventListener("fetch",e=>{ if(e.request.method!=="GET")return; e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))) });
