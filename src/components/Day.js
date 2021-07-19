import React from 'react';
import '../styles/Day.scss'

const Day = ({ day, food }) => {
    const formatFood = () => {
        let text = ''
        food.forEach( (item,index) =>{
            text += ` ${item.amount}x ${item.name}${ (index !== food.length-1)? ',':'' }`
        })
        return text
    }
    return (
        <div className='day'>
            <h2> Day { day } </h2>
            <p> { formatFood() } </p>
        </div>
    );
};


export default Day;
