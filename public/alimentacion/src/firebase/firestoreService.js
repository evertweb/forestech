import { db, auth } from './config';
import { collection, addDoc, onSnapshot, query, doc, deleteDoc } from "firebase/firestore";

// Función para guardar una nueva liquidación
export const saveSettlement = (settlementData) => {
    if (!auth.currentUser) return Promise.reject("Usuario no autenticado.");

    const userId = auth.currentUser.uid;
    const settlementsCol = collection(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users/${userId}/settlements`);

    return addDoc(settlementsCol, settlementData);
};

// Función para escuchar los cambios en el historial en tiempo real
export const listenToHistory = (callback) => {
    if (!auth.currentUser) return () => {}; // Devuelve una función de limpieza vacía si no hay usuario

    const userId = auth.currentUser.uid;
    const q = query(collection(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users/${userId}/settlements`));

    // onSnapshot establece un "oyente" que se actualiza automáticamente
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const history = snapshot.docs.map(doc => ({
            id: doc.id, // El ID del documento de Firestore
            ...doc.data()
        }));
        history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Ordenar por más reciente
        callback(history); // Llama a la función que nos pasen con los datos actualizados
    });

    return unsubscribe; // Devuelve la función para dejar de escuchar
};

// Función para eliminar un item del historial
export const deleteSettlement = (settlementId) => {
    if (!auth.currentUser) return Promise.reject("Usuario no autenticado.");

    const userId = auth.currentUser.uid;
    const docRef = doc(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users/${userId}/settlements`, settlementId);
    return deleteDoc(docRef);
};