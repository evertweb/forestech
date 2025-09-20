// combustibles/src/firebase/lazyFirebase.js
// Lazy loading para Firebase - optimiza el tiempo de carga inicial

let firebasePromise = null;

/**
 * Carga Firebase de manera lazy
 * @returns {Promise<Object>} - Módulos de Firebase
 */
export const loadFirebase = async () => {
  if (!firebasePromise) {
    firebasePromise = Promise.all([
      import('firebase/auth'),
      import('firebase/firestore'),
      import('firebase/storage'),
      import('./config'),
    ]).then(([authModule, firestoreModule, storageModule, configModule]) => {
      return {
        // Auth
        onAuthStateChanged: authModule.onAuthStateChanged,
        signInWithEmailAndPassword: authModule.signInWithEmailAndPassword,
        signOut: authModule.signOut,
        createUserWithEmailAndPassword: authModule.createUserWithEmailAndPassword,
        updateProfile: authModule.updateProfile,
        sendPasswordResetEmail: authModule.sendPasswordResetEmail,
        
        // Firestore
        doc: firestoreModule.doc,
        getDoc: firestoreModule.getDoc,
        setDoc: firestoreModule.setDoc,
        updateDoc: firestoreModule.updateDoc,
        deleteDoc: firestoreModule.deleteDoc,
        collection: firestoreModule.collection,
        getDocs: firestoreModule.getDocs,
        query: firestoreModule.query,
        where: firestoreModule.where,
        orderBy: firestoreModule.orderBy,
        limit: firestoreModule.limit,
        onSnapshot: firestoreModule.onSnapshot,
        serverTimestamp: firestoreModule.serverTimestamp,
        writeBatch: firestoreModule.writeBatch,
        runTransaction: firestoreModule.runTransaction,
        
        // Storage
        ref: storageModule.ref,
        uploadBytes: storageModule.uploadBytes,
        getDownloadURL: storageModule.getDownloadURL,
        deleteObject: storageModule.deleteObject,
        
        // Config
        auth: configModule.auth,
        db: configModule.db,
        storage: configModule.storage,
      };
    });
  }
  
  return firebasePromise;
};

/**
 * Funciones específicas para auth
 */
export const signOutFromFirebase = async () => {
  const { signOut, auth } = await loadFirebase();
  return signOut(auth);
};

export const signInWithEmailAndPassword = async (email, password) => {
  const { signInWithEmailAndPassword: signIn, auth } = await loadFirebase();
  return signIn(auth, email, password);
};

export const createUserWithEmailAndPassword = async (email, password) => {
  const { createUserWithEmailAndPassword: createUser, auth } = await loadFirebase();
  return createUser(auth, email, password);
};

/**
 * Re-exportar auth por compatibilidad
 */
export const getAuth = async () => {
  const { auth } = await loadFirebase();
  return auth;
};

export default {
  loadFirebase,
  signOutFromFirebase,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
};