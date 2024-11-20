import React, { useState, useEffect } from 'react';
import NavbarMe from "../NavBar/Navbar.jsx";
import Measures from "../Dashboard/Measures.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import PageHeader from "../Header/Header.jsx";

export function DashboardPage() {
    return (
        <>
            <NavbarMe/>
            <PageHeader text={"Dashboard"}></PageHeader>
            <div className="d-flex flex-column" id="content-wrapper">
                <div id="content">
                    <div className="container">
                        <Dashboard show_filters={true}/>
                        <Measures></Measures>
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

export default DashboardPage;
