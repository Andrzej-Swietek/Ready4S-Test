import React from 'react';

const Footer = () => {
    return (
        <footer style={style}>
            Andrzej Świętek &copy; 2021
        </footer>
    );
};

const style = {
    width: "100%", height: "5vh",
    background: "rgba(0,0,0,.1)",backdropFilter: 'blur(25px)',
    position: "fixed", bottom: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
}

export default Footer;
