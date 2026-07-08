/* ===== UPDATE CACHE VERSION ===== */
const CACHE="divdown-v3";
/* ===== END UPDATE CACHE VERSION ===== */

const FILES=["/","/index.html","/style.css","/menu.css","/tampilan_bahasa.css","/bahasa.js","/app.js"];
self.addEventListener("install",e=>{
e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
self.skipWaiting()
});
self.addEventListener("activate",e=>{
e.waitUntil(caches.keys().then(k=>Promise.all(k.map(i=>i!==CACHE&&caches.delete(i)))));
self.clients.claim()
});

self.addEventListener("fetch",e=>{
if(e.request.method!=="GET")return;
e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
});