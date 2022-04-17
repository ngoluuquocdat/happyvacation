importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyBdsu5NA56MBo6Sm8yMDqqv4__gwrBvV10",
    authDomain: "happyvacation-2abc8.firebaseapp.com",
    projectId: "happyvacation-2abc8",
    storageBucket: "happyvacation-2abc8.appspot.com",
    messagingSenderId: "510792644323",
    appId: "1:510792644323:web:7c268bad0fe29e401a37d6",
};
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});