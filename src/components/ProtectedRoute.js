import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isUserLogin = sessionStorage.getItem("chat_user")
    // console.log(isUserLogin);

    if (!isUserLogin)
        return <Navigate to={"/login"} replace />

    return children
}

export default ProtectedRoute