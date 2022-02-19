import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from '../form/Form';
import { AxiosInstance } from '../../axios/AxiosInstance';
import ShowError from '../show_error/ShowError';


const Signup = () => {
    const navigate = useNavigate()

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [number, setNumber] = useState()

    const [error, setError] = useState(null)

    const signupHandle = async (e) => {
        e.preventDefault()

        try {
            const userInfo = {
                name, email, number, password
            }

            const res = await AxiosInstance.post('/api/user/signup', userInfo)
            // console.log(res.data)

            localStorage.setItem("userId", JSON.stringify(res.data.userId))

            navigate('/otp/verification', { replace: true })
            return null

        } catch (error) {
            error.response &&
                setError(error.response.data.error)
        }
    }

    if (localStorage.getItem("user")) {
        navigate('/', { replace: true })
    }

    return (
        <>
            <Form button={"sign in"} parag={'login'} link={'/login'}>
                <form onSubmit={signupHandle} className='signup-login-form'>
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
