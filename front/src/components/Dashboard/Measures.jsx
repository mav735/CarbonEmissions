import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is included
import './Measures.css'; // Import CSS for the animation

export function Measures() {
    // Define a list of base tips
    const initialTips = [
        { id: 1, text: "Keep track of your tax-related documents." },
        { id: 2, text: "Review tax rates before submitting." },
        { id: 3, text: "Ensure correct fuel type selection." },
        { id: 4, text: "Double-check date ranges before submitting." },
        { id: 5, text: "Make regular backups of your data." }
    ];

    // State to track which tips are still available
    const [tips, setTips] = useState(initialTips);
    const [checkedTips, setCheckedTips] = useState({});

    // Handle checkbox change
    const handleCheckboxChange = (id) => {
        setCheckedTips((prevCheckedTips) => ({
            ...prevCheckedTips,
            [id]: !prevCheckedTips[id], // Toggle the checkbox state
        }));

        // Trigger the fade-out animation and remove the tip after a delay
        setTimeout(() => {
            setTips((prevTips) => prevTips.filter((tip) => tip.id !== id));
        }, 1000); // 1 second delay to let the animation finish
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header">
                    <h5 className="text-primary fw-bold m-0">Base tips</h5>
                </div>
                <div className="card-body">
                    <ul className="list-group">
                        {tips.map((tip) => (
                            <li
                                key={tip.id}
                                className={`list-group-item d-flex justify-content-between align-items-center ${checkedTips[tip.id] ? 'fade-out' : ''}`}
                            >
                                {/* Apply strikethrough style if the checkbox is checked */}
                                <span style={{ textDecoration: checkedTips[tip.id] ? 'line-through' : 'none' }}>
                                    {tip.text}
                                </span>
                                <input
                                    type="checkbox"
                                    checked={!!checkedTips[tip.id]}
                                    onChange={() => handleCheckboxChange(tip.id)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Measures;
