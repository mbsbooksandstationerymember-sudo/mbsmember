// ===== 版本号（每次更新改这里）=====
const CACHE_NAME = "mbs-cache-v1";

// ===== 需要预缓存的核心文件 =====
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


// ===============================
// 安装阶段
// ===============================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
  );

  // 立即进入 waiting
  self.skipWaiting();
});


// ===============================
// 激活阶段（删除旧缓存）
// ===============================
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

  // 立即接管页面
  self.clients.claim();
});


// ===============================
// 手动更新控制
// ===============================
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});


// ===============================
// 请求拦截策略
// ===============================
self.addEventListener("fetch", event => {

  // 只处理 GET 请求
  if (event.request.method !== "GET") return;

  const requestURL = new URL(event.request.url);

  // 只缓存同源资源（避免缓存 CDN 错误）
  if (requestURL.origin !== location.origin) {
    return;
  }

  event.respondWith(

    caches.match(event.request).then(cachedResponse => {

      // 有缓存 → 直接返回
      if (cachedResponse) {
        return cachedResponse;
      }

      // 没缓存 → 请求网络
      return fetch(event.request)
        .then(networkResponse => {

          // 只缓存成功的请求
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {

            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }

          return networkResponse;

        })
        .catch(() => {

          // 离线 fallback（只针对页面请求）
          if (event.request.destination === "document") {
            return caches.match("/mbsmember/index.html");
          }

        });

    })

  );
});
