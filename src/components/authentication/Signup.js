import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Form from '../form/Form';
import ShowError from '../show_error/ShowError';
import { AxiosInstance } from '../../axios/AxiosInstance';


const Signup = () => {
    const navigate = useNavigate()

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [number, setNumber] = useState()

    const [error, setError] = useState(null)

    const signupHandle = async (e) => {
        e.preventDefault()

        const userInfo = { name, email, password, number }

        try {
            const res = await AxiosInstance.post("/api/user/signup", userInfo)

            navigate("/otp/verification", { state: { userId: res.data.userId } })

        } catch (error) {
            error.response &&
                setError(error.response.data.error)
        }
    }

    if (sessionStorage.getItem("chat_user"))
        return <Navigate to={"/"} replace />

    return (
        <>
            <Form button={"login"} parag={'login'} link={'/login'}>
                <form className='signup-login-form' onSubmit={signupHandle}>
                    <h1>create account</h1>
                    <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} required />
                    <input type="number" placeholder='Number' onChange={e => setNumber(e.target.value)} required />
                    <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
                    <button className='signup-login-form-button'>Sign up</button>
                </form>

                <div className='form-second-div'>
                    <span>Or</span>
                    <br />
                    <Link to={'/login'}><button className='signup-login-form-button'>Login</button></Link>
                </div>
            </Form>

            {
                error &&
                <ShowError error={error} setError={setError} />
            }
        </>
    )
}

export default Signup
