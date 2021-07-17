import React from 'react';
import '../styles/Day.scss'

const Day = ({ day, food }) => {
    return (
        <div className='day'>
            <h2> Day { day } </h2>
            <p> { food } </p>
        </div>
    );
};


export default Day;
