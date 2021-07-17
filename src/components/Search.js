import React from 'react';
// import PropTypes from 'react'
import '../styles/Search.scss'

const Search = ({ onChange }) => {
    return (
        <div className='search'>
            <p> Number of days </p>
            <input type="text" onChange={(e)=> onChange( parseInt(e.target.value) )} />
        </div>
    );
};

// Search.propTypes = {
//     onChange: PropTypes.func
// }

export default Search;
