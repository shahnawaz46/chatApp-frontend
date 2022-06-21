import React, { useEffect } from 'react';
import Header from '../header/Header';
import AllUser from '../all_users/AllUsers';
import { useParams } from 'react-router-dom';
import { AxiosInstance } from '../../axios/AxiosInstance';
import { useStore } from '../../context/Context';

const Home = ({ children }) => {
    const { userName } = useParams()
    const { state: { socket } } = useStore()

    useEffect(() => {
        const userId = sessionStorage.getItem("chat_user")

        userId && socket && socket.emit("online_user", userId)

    }, [socket])

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
