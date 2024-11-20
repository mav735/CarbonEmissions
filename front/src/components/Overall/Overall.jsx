import React, { useState, useEffect } from 'react';
import NavbarMe from "../NavBar/Navbar.jsx";
import Measures from "../Dashboard/Measures.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Overall.css"
import PageHeader from "../Header/Header.jsx";

import img1 from './1.png';
import img2 from './2.png';
import img3 from './3.png';

// eslint-disable-next-line react/prop-types
const Card = ({ title, text, icon, color, id }) => {
    const backgroundImage = id === 1
        ? `url(${img1})`
        : id === 2
            ? `url(${img2})`
            : `url(${img3})`;

    const cardStyle = {
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'black',
    };

    return (
        <div className="card" style={cardStyle}>
            <div className="card-body text-center">
                <div style={{ color, fontSize: '2rem' }}>{icon}</div>
                <h5 className="card-title mt-2" style={{ color }}>{title}</h5>
                <p className="card-text">{text}</p>
            </div>
        </div>
    );
};

export function Overall() {
    const [wastes, setWastes] = useState({ daily: 0, monthly: 0, annually: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/wastes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: localStorage.getItem('user_id')
                    }),
                });

                const data = await response.json();
                setWastes({
                    daily: data.daily,
                    monthly: data.monthly,
                    annually: data.annually,
                });
            } catch (error) {
                console.error("Error fetching waste data:", error);
            }
        };
        fetchData();
    }, []);


    return (
        <>
            <NavbarMe/>
            <PageHeader text={"Overall statistics"}></PageHeader>
            <div className="d-flex flex-column" id="content-wrapper">
                <div id="content">
                    <div className="container">
                        <div className="row mb-4">
                        </div>

                        <div className="container my-5">
                                {/* Row with 3 cards */}
                                <div className="row mb-4">
                                    <div className="col-md-4">
                                        <Card
                                            title="Tax Daily"
                                            text={`${wastes.daily} $`}
                                            color={"rgba(0,0,0,255)"}
                                            id={1}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Card
                                            title="Tax Monthly"
                                            text={`${wastes.monthly} $`}
                                            color={"rgba(0,0,0,255)"}
                                            id={2}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Card
                                            title="Tax Annually"
                                            text={`${wastes.annually} $`}
                                            color={"rgba(0,0,0,255)"}
                                            id={3}
                                        />
                                    </div>
                                </div>

                                {/* Row with 2 cards */}
                                <div className="row card-container">
                                    <div className="col-md-6">
                                        <div title="Card 4"><Measures></Measures></div>
                                    </div>
                                    <div className="col-md-6">
                                        <div title="Card 5"><Dashboard></Dashboard></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="bg-white sticky-footer">
                        <div className="container my-auto">
                            <div className="text-center my-auto">
                                <span>Copyright © GENN 2024</span>
                            </div>
                        </div>
                    </footer>
                </div>

            </>
            );
            }

            export default Overall;
