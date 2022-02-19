import React, { useEffect, useState } from 'react';
import Form from '../form/Form';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/Context';
import { AxiosInstance } from '../../axios/AxiosInstance';
import ShowError from '../show_error/ShowError';

const Login = () => {
    const { state, dispatch } = useStore()
    const navigate = useNavigate()

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState(null)

    const loginHandle = async (e) => {
        e.preventDefault()
        try {
            const res = await AxiosInstance.post('/api/user/signin', { email, password })
            // console.log(res)
            dispatch({ type: "LOGIN_USER", payload: res.data.user })
            state.socket.emit("user_login", res.data.user._id)

            localStorage.setItem("user", JSON.stringify(res.data.user))

            navigate('/', { replace: true })
            return null

        } catch (error) {
            error.response &&
                // console.log(error.response.data)
                setError(error.response.data.error)
        }
    }

    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate('/', { replace: true })
        }
    }, [])

    return (
        <>
            <Form button={"sing up"} parag={'signup'} link={'/signup'}>
                <form onSubmit={loginHandle} className='signup-login-form'>
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
