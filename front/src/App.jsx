import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Tax } from './components/Tax/Tax.jsx';
import { Register } from './components/Register/Register.jsx';
import DashboardPage from "./components/Dashboard/DashBoardPage.jsx";
import Test from "./components/Dashboard/ChartModule.jsx";
import Login from "./components/Login/Login.jsx";
import Overall from "./components/Overall/Overall.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/tax" element={<Tax />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/test" element={<Test />} />
                <Route path="/login" element={<Login />} />
                <Route path="/main_page" element={<Overall />} />

                {/* Redirect all unknown paths to the login page */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
