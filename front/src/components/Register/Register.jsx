import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image_main from '../../assets/img/upscaledmain.jpeg';
import { Image } from 'react-bootstrap';

export function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_repeat: ''
    });

    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail);
            }

            const data = await response.json();
            setResponseMessage(data.message);
            localStorage.setItem('token', data.token); // Store the JWT
            localStorage.setItem('user_id', data.user_id); // Assume the response contains userId
            console.log(data)
            console.log(localStorage.getItem('user_id'));
            navigate('/main_page');
        } catch (error) {
            setResponseMessage(`Error: ${error.message}`);
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="container-fluid bg-black" style={{ minHeight: '90vh' }}>
            <div className="row justify-content-center">
                <div className="col-md-6" style={{ padding: 0 }}>
                    <Image src={image_main} fluid style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center" style={{ padding: 0 }}>
                    <div className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
                        <div className="text-center mb-4">
                            <h4 className="text-white">Create an Account!</h4>
                        </div>
                        <form className="user" onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <div className="col-sm-6">
                                    <input
                                        className="form-control form-control-user"
                                        type="text"
                                        placeholder="First Name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <input
                                        className="form-control form-control-user"
                                        type="text"
                                        placeholder="Last Name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <input
                                    className="form-control form-control-user"
                                    type="email"
                                    placeholder="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-6">
                                    <input
                                        className="form-control form-control-user"
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <input
                                        className="form-control form-control-user"
                                        type="password"
                                        placeholder="Repeat Password"
                                        name="password_repeat"
                                        value={formData.password_repeat}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                className="btn btn-primary btn-user w-100"
                                type="submit"
                            >
                                Register Account
                            </button>
                        </form>
                        {responseMessage && (
                            <div className="alert alert-info mt-3">
                                {responseMessage}
                            </div>
                        )}
                        <div className="text-center mt-3">
                            <Link className="small" to="/login">
                                Already have an account? Login!
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
