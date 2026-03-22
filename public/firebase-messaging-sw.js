importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// The config is usually injected from firebase-applet-config.json
// But since this is a static file, we'll need to use the values directly or fetch them.
// For now, we'll use a placeholder that the user can update or we can try to automate.

firebase.initializeApp({
  apiKey: "2cuSd9TiFsq0hjQ4aW6Lk55HK9x_FpyaqEeQODaF1Vg",
  authDomain: "TODO_AUTH_DOMAIN",
  projectId: "TODO_PROJECT_ID",
  storageBucket: "TODO_STORAGE_BUCKET",
  messagingSenderId: "TODO_MESSAGING_SENDER_ID",
  appId: "TODO_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
