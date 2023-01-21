importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDaYyvJ8aQHwjgyJrXvWYWmHYGoL-g7Vc8',
  authDomain: 'checkers-dev-40ef9.firebaseapp.com',
  projectId: 'checkers-dev-40ef9',
  storageBucket: 'checkers-dev-40ef9.appspot.com',
  messagingSenderId: '164934301829',
  appId: '1:164934301829:web:c39c540bfef552de4491ec',
  measurementId: 'G-NKRRPN176T',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
    data: {
      gameId: payload.data.gameId,
    },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (!event.notification.data.gameId) return;

  event.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
        type: 'window',
      })
      .then(async function (clientList) {
        const gameUrl = `/game/${event.notification.data.gameId}`;

        if (clientList && clientList.length > 0) {
          for (const client of clientList) {
            if ('focus' in client) {
              await client.focus();
            }
          }
        } else {
          if ('openWindow' in clients) {
            return clients.openWindow(gameUrl);
          }
        }
      })
  );
});
