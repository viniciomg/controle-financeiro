import { initializeApp,  } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
 const firebaseConfig = {
  apiKey: "AIzaSyAqu6cAVB5cWRAKtwA5ARJill5dJtWxyxs",
  authDomain: "finance-3f46e.firebaseapp.com",
  projectId: "finance-3f46e",
  storageBucket: "finance-3f46e.appspot.com",
  messagingSenderId: "659227998399",
  appId: "1:659227998399:web:b0fb42914b2aed24ea2e0a",
  
};
 // Initialize Firebase
 const firebaseApp = initializeApp(firebaseConfig);
 const db = getFirestore(firebaseApp);

 
 export default db;
