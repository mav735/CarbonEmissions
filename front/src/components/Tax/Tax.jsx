import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Helmet } from "react-helmet";
import '../../assets/css/styles.min.css';
import { NavbarMe } from "../NavBar/Navbar.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import PageHeader from "../Header/Header.jsx";

export function Tax() {
    // Coefficients for each fuel type in kg CO2 per unit
    const coefficients = {
        Coal: 2.7,  // 2.7 kg CO2/kg
        Gas: 2.0,   // 2.0 kg CO2/m³
        Oil: 3.1,   // 3.1 kg CO2/liter
    };

    // State to manage the fuel data
    const [fuelData, setFuelData] = useState([
        { fuelType: 'Coal', amount: 1000, taxRate: 2000, total: 0 }, // Default amount in kg
    ]);

    // Handler to update a specific fuel entry
    const handleInputChange = (index, field, value) => {
        const updatedData = [...fuelData];
        updatedData[index][field] = value;

        // Calculate total CO2 and tax when amount or taxRate is changed
        if (field === 'amount' || field === 'taxRate') {
            const coefficient = coefficients[updatedData[index].fuelType];
            const amountInUnits = updatedData[index].amount; // Amount is already in correct unit

            // Calculate total CO2 and total tax
            const totalCO2 = amountInUnits * coefficient; // Total CO2 in kg
            updatedData[index].total = totalCO2 * (updatedData[index].taxRate / 1000); // Tax rate per tonne converted to per kg
        }
        setFuelData(updatedData);
    };

    // Function to add a new fuel entry
    const addNewFuelType = () => {
        setFuelData([
            ...fuelData,
            { fuelType: 'Coal', amount: 0, taxRate: 0, total: 0 }, // Default new row
        ]);
    };

    // Function to delete a fuel entry
    const deleteFuelType = (index) => {
        const updatedData = fuelData.filter((_, i) => i !== index); // Remove the selected row
        setFuelData(updatedData);
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        try {
            // Format the data according to FuelDataRequest model
            const formattedData = {
                fuels: fuelData.map(fuel => ({
                    fuelType: fuel.fuelType,
                    amount: parseFloat(fuel.amount),
                    taxRate: parseFloat(fuel.taxRate),
                    total: fuel.total,
                })),
                user_id: localStorage.getItem('user_id')
            };

            console.log(formattedData);

            // Make POST request to your FastAPI server with the formatted data
            const response = await fetch('http://localhost:8000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            const result = await response.json();
            console.log('Submission result:', result);
            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Failed to submit data');
        }
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    };

    return (

        <>

            <NavbarMe />
            <div style={containerStyle}>
                <PageHeader text={"CO2 Tax Calculator"}></PageHeader>
                <div className="container px-3">
                    <div className="card bg-light shadow">
                        <div className="card-header py-3">
                            <p className="lead text-dark text-center m-0 fw-bold" style={{ lineHeight: '1.8' }}>
                                Calculator
                            </p>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive bg-transparent mt-2">
                                <table className="table bg-transparent">
                                    <thead className="bg-transparent">
                                    <tr className="bg-transparent">
                                        <th className="bg-transparent text-center">Actions</th>
                                        <th className="bg-transparent">Fuel type</th>
                                        <th className="bg-transparent">Amount</th>
                                        <th className="bg-transparent">Unit</th>
                                        <th className="bg-transparent">Tax rate (per tonne)</th>
                                        <th className="bg-transparent">Total CO2 Tax</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {fuelData.map((fuel, index) => (
                                        <tr className="bg-transparent" key={index}>
                                            <td className="bg-transparent text-center">
                                                <button
                                                    className="btn btn-link p-0"
                                                    onClick={() => deleteFuelType(index)}
                                                    aria-label="Delete"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} style={{ color: 'black' }} />
                                                </button>
                                            </td>
                                            <td className="bg-transparent">
                                                <select
                                                    value={fuel.fuelType}
                                                    onChange={(e) => handleInputChange(index, 'fuelType', e.target.value)}
                                                    className="form-control bg-transparent border-0"
                                                >
                                                    <option value="Coal">Coal</option>
                                                    <option value="Gas">Gas</option>
                                                    <option value="Oil">Oil</option>
                                                </select>
                                            </td>
                                            <td className="bg-transparent">
                                                <input
                                                    type="number"
                                                    value={fuel.amount}
                                                    onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                                    className="form-control bg-transparent border-0"
                                                />
                                            </td>
                                            <td className="bg-transparent">
                                                    <span className="form-control bg-transparent border-0">
                                                        {fuel.fuelType === 'Coal' ? 'kg' : fuel.fuelType === 'Gas' ? 'm³' : 'liters'}
                                                    </span>
                                            </td>
                                            <td className="bg-transparent">
                                                <input
                                                    type="number"
                                                    value={fuel.taxRate}
                                                    onChange={(e) => handleInputChange(index, 'taxRate', e.target.value)}
                                                    className="form-control bg-transparent border-0"
                                                />
                                            </td>
                                            <td className="bg-transparent">
                                                {fuel.total.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot className="bg-transparent">
                                    <tr className="bg-transparent">
                                        <td colSpan="5" className="bg-transparent">
                                            <strong>Total Tax:</strong>
                                        </td>
                                        <td className="bg-transparent">
                                            {fuelData.reduce((acc, fuel) => acc + fuel.total, 0).toFixed(2)}
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <button
                                        className="btn btn-primary rounded-pill"
                                        type="button"
                                        onClick={addNewFuelType}
                                    >
                                        Add new fuel type
                                    </button>
                                </div>
                                <div className="col">
                                    <button className="btn btn-dark" type="button" onClick={handleSubmit}>
                                        Submit new result
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-white sticky-footer">
                <div className="text-center">
                    <span>Copyright © GENN 2024</span>
                </div>
            </footer>
        </>
    );
}

export default Tax;
