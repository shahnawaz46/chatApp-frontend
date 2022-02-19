import React, { useEffect } from 'react';
import './ShowError.css';
import Alert from '@mui/material/Alert';

const ShowError = ({ error, setError }) => {

    useEffect(() => {
        setTimeout(() => {
            setError(null)
        }, 3000)
    }, [])

    return (
        <div className='showerror-main-div'>
            <Alert severity="error">{error}</Alert>
        </div>
    )
}

export default ShowError