import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider
} from 'firebase/auth';
import React, { createContext, useState } from 'react';
import { auth } from '../Firebasefunctions/db';


export const AuthContextProvider = createContext({});

const AuthContext = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({});
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const provider = new GoogleAuthProvider();
    auth.languageCode = 'it';

    onAuthStateChanged(auth, (currentuser) => {
        console.log('click');
        setUser(currentuser);
        setIsAuthenticated(true);
        setIsAuthLoading(false)
    })
    const login = async ({ email, password }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setIsAuthenticated(true);
            setUser(userCredential.user)
            return userCredential.user;
        } catch (error) {
            setIsAuthenticated(false);
            const errorMessage = error.message;
            throw new Error(errorMessage)
        }

    };
    const logout = () => {
        signOut(auth).then(() => {
            setIsAuthenticated(false);
            setUser({})
        }).catch((error) => {
            console.log(error);
        });
    }
    async function signup({ email, password }) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setIsAuthenticated(true);
            setUser(userCredential.user)
            return userCredential.user;
        } catch (error) {
            setIsAuthenticated(false);
            const errorMessage = error.message;
            throw new Error(errorMessage);
        }
    }
    async function handleSigninWithGmail() {
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            setUser(user);
            setIsAuthenticated(true);
            return user;
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            throw new Error(errorMessage);
        }
    }
    async function handleSignInWithApple() {
        const provider = new OAuthProvider('apple.com');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // Apple credential
            const credential = OAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;
            setUser(user);
            setIsAuthLoading(true);
            return user
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The credential that was used.
            const credential = OAuthProvider.credentialFromError(error);
            setIsAuthenticated(false);
            setUser({});
            throw new Error(errorMessage);
        }
    }
    const value = { login, signup, isAuthenticated, user, logout, isAuthLoading, handleSigninWithGmail, handleSignInWithApple };


    return <AuthContextProvider.Provider value={value}>{children}</AuthContextProvider.Provider>;
}

export default AuthContext;