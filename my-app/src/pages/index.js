import { useRouter } from 'next/router'; // Correct import
import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalState';
import authService from '../services/auth.service';
import jwtDecode from 'jwt-decode';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

function Page() {
    const router = useRouter();
    const { state, dispatch } = useGlobalState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        const username = email;
        authService
            .login(email, password, username)
            .then(async (resp) => {
                console.log(resp);
                if (resp.access) {
                    const accessToken = resp.access; // This is the access token
                    const refreshToken = resp.refresh;
                    
                    let data = jwtDecode(resp.access);
                    await dispatch({
                        type: 'SET_USER',
                        payload: data,
                    });
                    router.push('/Home'); // Correct route
                } else {
                    console.log('Login failed');
                    dispatch({ type: 'LOGOUT_USER' });
                }
            });
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 border">
            <div className="text-center p-4">
                <h1>Command Center</h1>
                <h5 className="text-center">A place for Gamers to connect and track their stats!</h5>
                <form
                    onSubmit={handleLogin}
                    className="mx-auto my-auto border-2 bg-mtgray p-4"
                >
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pass" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="pass"
                            name="password"
                            minLength="8"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Sign in</button>
                    </div>
                </form>
                <div className="mt-2">
                    <span>Don't Have An Account? Register </span>
                    <Link href="/register">Here</Link>
                </div>
            </div>
        </div>
    );
    
    
    
}

export default Page;
