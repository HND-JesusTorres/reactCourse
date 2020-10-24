import React, { useState, useEffect } from 'react';
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import fire from './fire'
import './App.css'

const App  = () => {
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [hasAccount, setHasAccount] = useState('');

    const clearInput = () => {
        setEmail('')
        setPassword('');
    }

    const clearErrors = () => {
        setEmailError('');
        setPasswordError('');
    }

    const handleLogin = () => {
        clearErrors();
        fire
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(err => {
                switch(err.code) {
                    case 'auth/invalid-email':
                    case 'auth/user-disabled':
                    case 'auth/user-not-found':
                        setEmailError(err.message);
                        break;
                    case 'auth/wrong-password':
                        setPasswordError(err.message)
                        break;
                    default: 
                        setEmailError('something went wrong!')
                }
            })
    }

    const handleSignUp = () => {
        clearErrors();
        fire
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(err => {
                switch(err.code) {
                    case 'auth/email-already-in-use':
                    case 'auth/invalid-email':
                        setEmailError(err.message)
                        break;
                    case 'auth/weak-password':
                        setPasswordError(err.message)
                        break;
                    default:
                        setEmailError('something went wrong!')
                }
            })
    }

    const handleLogout = () => {
        fire.auth().signOut();
    }

    const authListener = () => {
        fire.auth().onAuthStateChanged(user => {
            if(user){
                clearInput()
                setUser(user)
            } else {
                setUser('');
            }
        })
    }

    useEffect(() => {
        authListener();
    }, [user])
    return (
        <div className="App">
            {user ? (
                <Dashboard handleLogout={handleLogout} />
            ) : (
                <Login 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                handleSignUp={handleSignUp}
                hasAccount={hasAccount}
                setHasAccount={setHasAccount}
                emailError={emailError}
                passwordError={passwordError}
            />
            )}
        </div>
    )
}

export default App;
