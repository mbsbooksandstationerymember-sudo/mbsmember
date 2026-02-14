// ===== Service Worker (稳定版) =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/mbsmember/sw.js')
    .then(() => navigator.serviceWorker.ready)
    .then(() => {
      console.log("Service Worker Ready & Controlling Page");
    })
    .catch(err => console.log("SW error:", err));
}
