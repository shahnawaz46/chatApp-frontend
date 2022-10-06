import React, { useState } from 'react';
import Form from '../form/Form';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import ShowError from '../show_error/ShowError';
import { AxiosInstance } from '../../axios/AxiosInstance';
import { useStore } from '../../context/Context';

const Login = () => {
    const navigate = useNavigate()
    const {state:{socket}} = useStore()

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState(null)

    const loginHandle = async (e) => {
        e.preventDefault()

        try {
            const res = await AxiosInstance.post('/api/user/signin', { email, password })

            // socket.emit("online_user", res.data.userId)
            localStorage.setItem("chat_user", res.data.userId)

            navigate("/", { replace: true })

        } catch (err) {
            err.response &&
                setError(err.response.data.error)
        }
    }

    if (localStorage.getItem("chat_user"))
        return <Navigate to={"/"} replace />

    return (
        <>
            <Form button={"sign up"} parag={'signup'} link={'/signup'}>
                <form className='signup-login-form' onSubmit={loginHandle}>
                    <h1>Login Account</h1>
                    <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
                    <button className='signup-login-form-button'>Login</button>
                </form>

                <div className='form-second-div'>
                    <span>Or</span>
                    <br />
                    <Link to={'/signup'}><button className='signup-login-form-button'>Signup</button></Link>
                </div>
            </Form>

            {
                error &&
                <ShowError error={error} setError={setError} />
            }
        </>
    )
};

export default Login;
