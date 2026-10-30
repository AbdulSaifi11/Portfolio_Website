import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  getFirestore,
} from 'firebase/firestore/lite';
import { app } from '../../Confige_firebase/config.js';

const db = getFirestore(app);
const messagesCollection = collection(db, 'contactMessages');
// Create: public visitors can submit a message; Firestore rules validate the fields.
export function createContactMessage({ name, email, phone, address }) {
  return addDoc(messagesCollection, {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    address: address.trim(),
    status: 'new',
    createdAt: serverTimestamp(),
  });
}

// Read: Firestore rules require the signed-in user to be the configured admin.
// Firestore Lite reads on demand; the inbox has an explicit refresh action.
export async function listContactMessages() {
  const orderedMessages = query(messagesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(orderedMessages);
  return snapshot.docs.map((message) => ({ id: message.id, ...message.data() }));
}

// Update: edit contact details and workflow status without changing creation time.
export function updateContactMessage(id, { name, email, phone, address, status }) {
  return updateDoc(doc(db, 'contactMessages', id), {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    address: address.trim(),
    status,
    updatedAt: serverTimestamp(),
  });
}

// Delete: available only to the admin according to firestore.rules.
export function deleteContactMessage(id) {
  return deleteDoc(doc(db, 'contactMessages', id));
}
