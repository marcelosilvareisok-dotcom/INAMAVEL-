import { getToken, onMessage } from 'firebase/messaging';
import { messaging, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const VAPID_KEY = '2cuSd9TiFsq0hjQ4aW6Lk55HK9x_FpyaqEeQODaF1Vg'; // User will need to provide this from Firebase Console

export async function requestNotificationPermission(userId: string) {
  if (!messaging) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY
      });

      if (token) {
        // Save token to user profile
        await updateDoc(doc(db, 'users', userId), {
          fcmToken: token,
          notificationsEnabled: true
        });
        return token;
      }
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
  return null;
}

export function onMessageListener() {
  if (!messaging) return;
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}

export async function disableNotifications(userId: string) {
  await updateDoc(doc(db, 'users', userId), {
    notificationsEnabled: false
  });
}
