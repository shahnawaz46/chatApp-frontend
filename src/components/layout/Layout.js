import React, { useEffect } from 'react';
import Header from '../header/Header';
import AllUser from '../all_users/AllUsers';
import { useParams } from 'react-router-dom';

const Home = ({ children }) => {
    const { userName } = useParams()
    console.log(userName);

    return (
        <>
            <Header />
            <div style={{ display: "flex" }}>

                <AllUser userName={userName} />
                {children}
            </div>
        </>
    )
}

export default Home
