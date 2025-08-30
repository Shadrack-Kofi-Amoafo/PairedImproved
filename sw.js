// Basic service worker for Paired (cache shell & fallback)
const CACHE_NAME='paired-shell-v1';
const CORE=[
  'Homepage.html','shared-ui.js','styles.css','theme.js','Bookmarks.html'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  const whitelist=[CACHE_NAME,'paired-img-v1'];
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>!whitelist.includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// Runtime strategies: origin shell (cache-first) + external images (stale-while-revalidate)
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return; 
  const url=new URL(e.request.url);
  const isSameOrigin = url.origin===location.origin;
  // Stale-while-revalidate for picsum + image requests (opt-in)
  const isRuntimeImage = /picsum\.photos/.test(url.hostname) || (e.request.destination==='image' && !isSameOrigin);
  if(isRuntimeImage){
    e.respondWith((async()=>{
      const cache = await caches.open('paired-img-v1');
      const cached = await cache.match(e.request);
      const fetchPromise = fetch(e.request, {cache:'no-store'}).then(resp=>{
        if(resp && resp.status===200){ cache.put(e.request, resp.clone()); }
        return resp;
      }).catch(()=>cached);
      return cached || fetchPromise;
    })());
    return;
  }
  if(isSameOrigin){
    e.respondWith(
      caches.match(e.request).then(r=> r || fetch(e.request).then(resp=>{
        if(resp.ok && (resp.type==='basic' || resp.type==='default')){ const copy=resp.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request, copy)); }
        return resp;
      }).catch(()=> caches.match('Homepage.html')))
    );
  }
});
