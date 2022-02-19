import React, { useEffect } from 'react';
import Layout from './layout/Layout';
import { useStore } from '../context/Context';

const InitialMessageSection = () => {
    const { dispatch } = useStore()

    useEffect(() => {
        // console.log("initialMessageSection useEffect()");
        dispatch({ type: "CLOSE_CHAT" })
    }, [])
    return (
        <Layout>
            <div className="initial-message-div">
                Global Talk
            </div>
        </Layout>
    );
};

export default InitialMessageSection;
