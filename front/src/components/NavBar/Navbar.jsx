import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import '../../assets/css/styles.min.css';
import '../../assets/js/script.min.js';
import {Helmet} from "react-helmet";
import {useEffect, useState, useRef} from 'react';
import {FaChartPie} from "react-icons/fa";

export function NavbarMe() {
    const [showNavbar, setShowNavbar] = useState(false);
    const navbarRef = useRef(null); // Create a ref for the navbar

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (event.clientX < 10) {
                setShowNavbar(true);
            } else {
                if (showNavbar) {
                    console.log(event.clientX);
                    if (event.clientX > 250) {
                        setShowNavbar(false);
                    }
                }
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [showNavbar]);

    return (
        <>
            <Helmet>
                <link rel='stylesheet'
                      href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'/>
            </Helmet>
            <div className="container-fluid d-flex">
                {/* Navbar Container */}
                <div
                    ref={navbarRef}
                    className={`navbar bg-dark bg-gradient align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark ${showNavbar ? 'fade-in' : 'fade-out'}`}
                    style={{
                        color: 'rgb(181, 188, 239)',
                        background: 'rgb(25, 25, 12)',
                        width: showNavbar ? '250px' : '0', // Set a fixed width when showing
                        overflow: 'hidden', // Prevent overflow when hidden
                        transition: 'width 0.2s, opacity 0.2s',
                        opacity: showNavbar ? 1 : 0,
                    }}
                    data-bs-theme="dark"
                >
                    <div className="container-fluid d-flex flex-column p-0">
                        <div>
                            <span className="text-uppercase fs-2 fw-normal"
                                  style={{color: 'rgb(255, 255, 255)', alignSelf: "center"}}>GENN</span>
                        </div>
                        <hr className="sidebar-divider my-0"/>
                        <ul style={{listStyleType: 'none', padding: 30}}>
                            <li className="nav-item">
                                <a className="nav-link text-start" href="/main_page"
                                   style={{color: 'white', fontSize: '0.7rem'}}>
                                    <FaChartPie/>
                                    <span className="ms-1">OVERALL</span>
                                </a>
                            </li>


                            <li className="nav-item">
                                <a className="nav-link text-start" href="/dashboard"
                                   style={{color: 'white', fontSize: '0.7rem'}}>
                                    <i className="fa fa-bar-chart" aria-hidden="true"></i>
                                    <span className="ms-1">GRAPH</span>
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link text-start active" href="/tax"
                                   style={{color: 'white', fontSize: '0.7rem'}}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                        className="bi bi-calculator"
                                    >
                                        <path
                                            d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                                        <path
                                            d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"></path>
                                    </svg>
                                    <span className="ms-2">TAX</span>
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="/login" style={{color: 'white', fontSize: '0.7rem'}}>
                                    <i className="fa fa-user" aria-hidden="true"></i>
                                    <span className="ms-2">SIGN IN/UP</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Main Content Area */}
                <div style={{flex: 1, transition: 'margin-left 0.2s'}}>
                    {/* Your main content goes here */}
                </div>
            </div>
        </>
    );
}

export default NavbarMe;
