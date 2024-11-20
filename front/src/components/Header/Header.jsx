import React from 'react';
import headerImage from './header.png'; // Adjust path based on your project structure

// eslint-disable-next-line react/prop-types
const PageHeader = ({ text }) => {
    const headerStyle = {
        backgroundImage: `url(${headerImage})`, // Use the imported image here
        backgroundSize: 'cover', // Ensures the image covers the entire header area, may crop
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents repeating the image
        color: 'black',
        padding: '20px',
        textAlign: 'center',
        height: '85px', // Adjust this value based on how tall you want the header
        width: '100vw', // Ensures the header spans the full width of the viewport
        margin: 0, // Removes any default margin
    };

    return (

        <header style={headerStyle}>
            <h1>{text}</h1>
        </header>
    );
};

export default PageHeader;
