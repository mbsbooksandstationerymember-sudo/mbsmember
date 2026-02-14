const CACHE_NAME = "mbs-cache-v1";

// ===== 需要缓存的核心文件 =====
const CORE_ASSETS = [
  "/mbsmember/",
  "/mbsmember/index.html",
  "/mbsmember/member",
  "/mbsmember/manifest.json",
  "/mbsmember/logo-192.png",
  "/mbsmember/logo-512.png",
  "/mbsmember/png1.png",
  "/mbsmember/png2.png",
  "/mbsmember/png3.png"
];

// ===== 安装时缓存 =====
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// ===== 激活时清理旧缓存 =====
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ===== 请求拦截 =====
self.addEventListener("fetch", event => {

  // 只处理 GET 请求
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(networkResponse => {

            // 自动缓存新资源
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type === "basic"
            ) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, clone);
              });
            }

            return networkResponse;
          })
          .catch(() => {
            // 离线 fallback
            return caches.match("/mbsmember/index.html");
          });
      })
  );
});
