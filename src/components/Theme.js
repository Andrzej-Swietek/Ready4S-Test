import React, {useState} from 'react';
import '../styles/Theme.scss'

const Theme = () => {
    const [theme, setTheme] = useState('dark');
    const changeTheme = () => {
        document.body.classList.toggle('darkTheme');
        setTheme( (theme === 'light')? 'dark':'light'  )
    }
    return (
        <div className={ `themeToggler ${ theme === 'light'? 'light': 'dark' }` } onClick={ changeTheme }>
            {
                theme === 'light'? (<i className="fas fa-moon"></i>) : (<i className="fas fa-sun"></i>)
            }
        </div>
    );
};

export default Theme;
