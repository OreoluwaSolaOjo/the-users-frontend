import React, { useState } from 'react';
// import firebase from '../../firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { API_BASE_URL } from '../utils/base_url';
import { z, ZodError } from 'zod';


const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6) // Example: password should be at least 8 characters
});
interface LoginProps {
    onLogin: () => void;

}
type ErrorType = {
    message: string;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ErrorType[]>([]);


    // const handleLogin = () => {
    //     if (username && password) {
    //         onLogin();
    //     }
    // };

    // const handleLogin = async () => {
    //     setAuthing(true);
    //     // try {
    //     //     await firebase.auth().signInWithEmailAndPassword(email, password);
    //     //     alert('Logged in successfully');
    //     //     // Get the Firebase token to be sent to your backend for verification
    //     //     const token = await firebase.auth().currentUser?.getIdToken();
    //     //     console.log("Firebase Token:", token);
    //     // } catch (error: any) {
    //     //     alert('Error logging in: ' + error.message);
    //     // }

    //     // createUserWithEmailAndPassword(auth, email, password)
    //     //     .then((userCredential) => {
    //     //         // Signed in 
    //     //         const user = userCredential.user;
    //     //         console.log("this is the user", user)
    //     //         // ...
    //     //     })
    //     //     .catch((error) => {
    //     //         const errorCode = error.code;
    //     //         const errorMessage = error.message;
    //     //         // ..
    //     //     });
    //     signInWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             // Signed in 
    //             const user = userCredential.user;
    //             // ...
    //         })
    //         .catch((error) => {
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //         });
    // };
    const [token, setToken] = useState('')
    const handleLogin = async () => {
        setAuthing(true);
        try {
            try {
                LoginSchema.parse({
                    email: email,
                    password: password
                });
            }
            catch (error: any) {
                setAuthing(false);
                if (error instanceof z.ZodError) {
                    setErrors(error.errors.map(e => ({ message: e.message })));
                }
                return;
            }


            console.log("this is email and pass", email + ' ' + password)
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user: any = userCredential.user;
            console.log("user herer", user);
            const token = await user.getIdToken();
            console.log("this is token", token)
            setToken(token);
            localStorage.setItem("userToken", token);
            localStorage.setItem("email", user.email);
            // Send the token to your backend
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            // const response = await fetch('http://localhost:3002/api/users/set-admin', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         // 'Authorization': token
            //     },
            //     body: JSON.stringify({uid: user.uid})
            // });
            const data = await response.json();
            console.log("this is response", data)
            const idTokenResult = await user.getIdTokenResult();
            console.log("user", user)
            console.log("idtoken", idTokenResult)
            if (idTokenResult.claims.admin) {
                // The user is an admin.
                // You can now adapt your frontend UI/UX accordingly.
                navigate('/admin')
            } else {
                navigate("/")
            }
            setAuthing(false)
        } catch (error: any) {
            alert('Error logging in: ' + error.message);
        }
    };

    return (
        <div className='container-login'>
            <div><h4>Login</h4></div>
            {errors.map(err => {
                return (
                    <p className='error-tag'>{err.message}</p>
                )
            })}

            <div>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button className='login-btn' onClick={handleLogin}>{authing ? 'Authenticating...' : 'Login'}</button>
        </div>
    );
}

export default Login;
