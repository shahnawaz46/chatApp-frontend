import React from 'react';
import './Form.css';
import { Link } from 'react-router-dom';

const Form = ({ button, parag, link, children }) => {
    return (
        <div className='form-main-div'>
            <div className="form-title">
                <h1>welcome back</h1>
                <p>To keep connected with us please {parag}</p>
                <Link to={link}><button className='form-button'>{button}</button></Link>
            </div>
            {children}
        </div>
    )
};

export default Form;
