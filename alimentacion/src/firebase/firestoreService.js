// src/firebase/firestoreService.js
import { db, auth } from './config';
import { collection, addDoc, onSnapshot, query, doc, deleteDoc, updateDoc } from "firebase/firestore";

export const saveSettlement = (settlementData) => {
    if (!auth.currentUser) return Promise.reject("Usuario no autenticado.");
    const userId = auth.currentUser.uid;
    const settlementsCol = collection(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users/${userId}/settlements`);
    return addDoc(settlementsCol, settlementData);
};

export const listenToHistory = (callback) => {
    if (!auth.currentUser) return () => {};

    const userId = auth.currentUser.uid;
    const q = query(collection(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users/${userId}/settlements`));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const history = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        callback(history);
    });

    return unsubscribe;
};

export const deleteSettlement = (settlementId) => {
    if (!auth.currentUser) return Promise.reject("Usuario no autenticado.");

    const userId = auth.currentUser.uid;
    const docRef = doc(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users/${userId}/settlements`, settlementId);
    return deleteDoc(docRef);
};

export const updateSettlementPayment = (settlementId, receiptBase64) => {
    if (!auth.currentUser) return Promise.reject("Usuario no autenticado.");

    const userId = auth.currentUser.uid;
    const docRef = doc(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users/${userId}/settlements`, settlementId);

    return updateDoc(docRef, {
        status: 'Pagada',
        comprobantePagoBase64: receiptBase64 // Este también deberíamos subirlo a Storage en el futuro
    });
};