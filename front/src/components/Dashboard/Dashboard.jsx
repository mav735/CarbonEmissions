import React, { useState, useEffect } from 'react';
import NavbarMe from "../NavBar/Navbar.jsx";
import ChartModule from './ChartModule';
import DatePicker from 'react-datepicker';
import Measures from "./Measures.jsx";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

// eslint-disable-next-line react/prop-types
export function Dashboard({show_filters}) {
    const [filterType, setFilterType] = useState("Coal");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [chartData, setChartData] = useState({
        labels: ["Error"],
        datasets: [
            {
                label: `${filterType} Total`,
                data: [0],
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState({ datasetIndex: null, dataIndex: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/chart-data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: localStorage.getItem('user_id'),
                        fuel_type: filterType,
                        start_date: startDate ? startDate.toISOString() : '',
                        end_date: endDate ? endDate.toISOString() : '',
                    }),
                });

                const data = await response.json();
                const filteredData = data?.chart_data || [];

                if (filteredData.length > 0) {
                    let timestamps = filteredData.map((item) => item.timestamp);
                    const totals = filteredData.map((item) => item.total);
                    timestamps = timestamps.map(datetime => datetime.split('T')[0]);

                    setChartData({
                        labels: timestamps,
                        datasets: [
                            {
                                label: `${filterType} Total`,
                                data: totals,
                                fill: true,
                                backgroundColor: 'rgba(78, 115, 223, 0.2)',
                                borderColor: 'rgba(78, 115, 223, 1)',
                            },
                        ],
                    });
                } else {
                    setChartData({
                        labels: ["No Data Available"],
                        datasets: [
                            {
                                label: `${filterType} Total`,
                                data: [0],
                                fill: true,
                                backgroundColor: 'rgba(200, 200, 200, 0.2)',
                                borderColor: 'rgba(200, 200, 200, 1)',
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [filterType, startDate, endDate]);

    const handlePointClick = (datasetIndex, dataIndex) => {
        setSelectedPoint({ datasetIndex, dataIndex });
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        const { datasetIndex, dataIndex } = selectedPoint;

        const updatedDatasets = [...chartData.datasets];
        const updatedLabels = [...chartData.labels];

        updatedDatasets[datasetIndex].data.splice(dataIndex, 1);
        updatedLabels.splice(dataIndex, 1);

        setChartData({
            ...chartData,
            labels: updatedLabels,
            datasets: updatedDatasets,
        });

        setShowModal(false);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className="container mt-4">
                <div id="content">
                    <div className="container">
                        {/* Date Range Picker */}
                        {show_filters && (<div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label" color={"black"}>Start Date:</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={date => setStartDate(date)}
                                        dateFormat="yyyy/MM/dd"
                                        isClearable
                                        placeholderText="Select a start date"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">End Date:</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={date => setEndDate(date)}
                                        dateFormat="yyyy/MM/dd"
                                        isClearable
                                        placeholderText="Select an end date"
                                    />
                                </div>
                            </div>
                        </div>)}


                        {/* Chart Module */}
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <div className="card shadow">
                                    <div className="card-header d-flex justify-content-between align-items-center">

                                        <h5 className="text-primary fw-bold m-0" href={"/dashboard"}>Tax Overview</h5>
                                        <div>
                                            <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                                <option value="Coal">Coal</option>
                                                <option value="Oil">Oil</option>
                                                <option value="Gas">Gas</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="chart-area">
                                            <ChartModule
                                                chartData={chartData}
                                                chartOptions={{ responsive: true }}
                                                onPointClick={handlePointClick}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for confirming point deletion */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this data point?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Dashboard;
