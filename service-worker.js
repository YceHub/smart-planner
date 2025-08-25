const CACHE_NAME = "planner-cache-v1";
const FILES_TO_CACHE = [
  "planner.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

// Install SW
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Fetch
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// Activate
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
    )
  );
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.createElement('button');
  btn.textContent = 'Install Planner';
  btn.onclick = () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      console.log('User choice:', choice.outcome);
      deferredPrompt = null;
      btn.remove();
    });
  };
  document.body.appendChild(btn);
});
