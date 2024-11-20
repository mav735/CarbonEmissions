import React, { useState } from 'react';
import image_main from '../../assets/img/upscaledmain.jpeg';
import { Image } from 'react-bootstrap';
import axios from 'axios';  // Axios for making HTTP requests

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Post login data to FastAPI `/token` endpoint
            const response = await axios.post('http://localhost:8000/token', {
                email: email,
                password: password
            });

            localStorage.setItem('token', response['data']['access_token']);
            localStorage.setItem('user_id', response['data']['user_id']);
            // Redirect or show success message
            window.location.href = "/main_page";  // Redirect to another page after successful login
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            // Handle login error
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="container-fluid bg-black">
            <div className="row">
                <div className="col-md-6" style={{padding: 0}}>
                    <Image src={image_main} fluid style={{width: '100%', height: 'auto'}} />
                </div>
                <div className="col-md-6" style={{marginTop: '300px', paddingTop: '65px'}}>
                    <div className="text-center justify-content-center align-content-center flex-wrap p-5">
                        <div className="text-center">
                            <h4 className="text-white mb-4" style={{ borderColor: 'rgb(255,255,255)' }}>
                                Welcome back!
                            </h4>
                        </div>
                        <form className="user" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    className="form-control form-control-user"
                                    type="email"
                                    id="exampleInputEmail"
                                    aria-describedby="emailHelp"
                                    placeholder="Email Address"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-6 col-lg-12 mb-3 mb-sm-0">
                                    <input
                                        className="form-control form-control-user"
                                        type="password"
                                        id="examplePasswordInput"
                                        placeholder="Password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            {error && <div className="text-danger mb-3">{error}</div>}
                            <button
                                className="btn btn-primary font-monospace fs-6 fw-semibold link-dark d-block btn-user w-100"
                                type="submit"
                            >
                                Login
                            </button>
                            <hr/>
                        </form>
                        <div className="text-center">
                            <a className="small" href="/register">
                                Don't have an account? Register!
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
