import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// eslint-disable-next-line react/prop-types
const ChartModule = ({ chartData, chartOptions, onPointClick }) => {

    if (!chartData) {
        return null; // Ensure there's a fallback for missing data
    }

    // Handle click on chart points
    const handleClick = (event, elements) => {
        if (elements.length > 0) {
            const element = elements[0];
            const datasetIndex = element.datasetIndex;
            const dataIndex = element.index;

            // Trigger the point click handler passed as a prop
            onPointClick(datasetIndex, dataIndex);
        }
    };

    // Add the onClick event handler to the chart options
    const optionsWithClick = {
        ...chartOptions,
        onClick: handleClick, // Attach the click handler here
    };

    return <Line data={chartData} options={optionsWithClick} />;
};

export default ChartModule;
