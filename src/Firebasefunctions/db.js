// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./FirebaseConfig";
import { getAuth } from "firebase/auth";
import {
    getDocs,
    updateDoc,
    deleteDoc,
    getFirestore,
    addDoc,
    getDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const auth = getAuth();

//create documents
export const addDocumentData = async (collectionRef, data) =>{
    try {
        const res = await addDoc(collectionRef, data);
        return res;
    } catch (error) {
        return error
    }
}


//read documents
export const getAllData = async (collectionRef) =>{
    try {
        const res = await getDocs(collectionRef);
        const allData = res.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            key: doc.id
        }));
        return allData; 
    } catch (error) {
        return error;
    }
}

export const getAData = async (collectionRef) =>{
    try {
        const res = await getDoc(collectionRef);
        return res.data();
    } catch (error) {
        return error;
    }
}
// const getUsers = async () => {
//     const userCollection = query(usersCollectionRef, orderBy('createdAt', 'asc'));
//                         const userData = await getDocs(userCollection);
//                         const userdat = userData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//                     console.log(userdat);
                    
//     const t = query(timeSchedulingRef);
//     onSnapshot(t, (snapshot) => {
//         const times = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//         setTimesData(times[0])
//     })
//     const s = query(seatCollectionRef)
//     onSnapshot(s, (snapshot) => {
//         const seat = snapshot.docs.map((doc) => doc.data());
//         setSeatData(seat)
//     })
// };

//update
export const editData = async (docRef, newData) => {
    try {
        const res = await updateDoc(docRef, newData)
        return res;
    } catch (error) {
        return error;
    }
}

//delete doc
export const deleteDocument = async (docRef) => {
  try {
    const res =  await deleteDoc(docRef);
    return res;
  } catch (error) {
    return error;
  }
}