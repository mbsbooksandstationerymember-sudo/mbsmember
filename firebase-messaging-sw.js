importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

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

// Menghandle notifikasi bila telefon tengah 'sleep' atau browser tutup
messaging.onBackgroundMessage((payload) => {
  console.log('Mesej diterima:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'png1.png' // Gunakan gambar kad anda sebagai ikon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});