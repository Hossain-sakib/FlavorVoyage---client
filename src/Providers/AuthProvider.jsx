import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from "../Firebase/firebase.config";





export const AuthContext = createContext(null);
const auth = getAuth(app);


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // sign up
    const signUpUser = (email, password, name, image) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return updateProfile(user, {
                    displayName: name,
                    photoURL: image,
                })
                    .then(() => {
                        setUser(user);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error updating user profile:", error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error("Error signing up user:", error);
                setLoading(false);
            });
    }

    // sign in
    // signin
    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }


    // google sign in
    const googleProvider = new GoogleAuthProvider();
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);

    }


    // sign out
    const signOutUser = () => {
        setLoading(true);
        return signOut(auth);
    }


    // observer
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log('user:', currentUser);
            setUser(currentUser);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        }
    }, [])


    const authInfo = {
        signUpUser,
        signInUser,
        signOutUser,
        googleSignIn,
        user,
        loading
    }


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;