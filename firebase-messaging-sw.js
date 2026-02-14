// firebase-messaging-sw.js (using compat SDKs)

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace with the latest version of the Firebase JS SDK if needed.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// You MUST use the same config as in your index.html
const firebaseConfig = {
  apiKey: "AIzaSyBvbS5Uz4-o60SFr8Mk-bQnRb-jLOrGjwY",
  authDomain: "mbs-member.firebaseapp.com",
  projectId: "mbs-member",
  storageBucket: "mbs-member.firebasestorage.app",
  messagingSenderId: "456825217147",
  appId: "1:456825217147:web:ab37d115902b23dc7582de"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new message.',
    icon: payload.notification.icon || 'png1.png', // Use your card image or a default icon
    data: {
      url: payload.data?.click_action || '/', // Default to root if no click_action is provided
      // You can pass additional data here from your FCM message 'data' payload
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.', event);
  event.notification.close(); // Close the notification

  const urlToOpen = event.notification.data.url;

  // This looks for a client (tab) that's already open and focuses it,
  // otherwise it opens a new window/tab.
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
        return null;
      })
  );
});
