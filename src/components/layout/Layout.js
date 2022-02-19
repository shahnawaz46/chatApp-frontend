import React, { useEffect } from 'react';
import Header from '../header/Header';
import AllUser from '../all_users/AllUsers';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/Context';

const Home = ({ children }) => {
    const navigate = useNavigate()

    useEffect(() => {
        // console.log("Layout useEffect()")
        if (!localStorage.getItem("user")) {
            navigate('/login')
        }
    }, [])

    return (
        <>
            <Header />
            <div style={{ display: "flex" }}>
                <AllUser />
                {children}
            </div>
        </>
    )
}

export default Home
