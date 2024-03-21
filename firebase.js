import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FCM_MEASURMENT_ID,
};

const app = initializeApp(firebaseConfig);

const initializeMessaging = () => {
  try {
    return getMessaging(app);
  } catch (e) {
    console.log(e);
  }
};

const messaging = window?.Notification ? initializeMessaging() : null;

export const messagingGetToken = async () => {
  if (messaging) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
      });
    }
  }
};

if (messaging) {
  onMessage(messaging, (payload) => {
    const message = payload;

    new Notification(message.notification.title, {
      body: message.notification.body,
      icon: message.notification.icon,
    });
  });
}
