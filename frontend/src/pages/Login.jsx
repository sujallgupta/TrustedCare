import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { backendURL, token, setToken } = useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendURL}/api/user/register`, {
          name,
          password,
          email,
        })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(`${backendURL}/api/user/login`, {
          password,
          email,
        })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
      console.error(error)
    }
  }

  const handleDemoLogin = async (e) => {
    e.preventDefault()
    try {
      const demoEmail = 'demo@trustedcare.com'
      const demoPassword = '@Trustedcaredemo123'

      const { data } = await axios.post(`${backendURL}/api/user/login`, {
        email: demoEmail,
        password: demoPassword,
      })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Logged in as Demo User')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Demo login failed')
      console.error(error)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form
      onSubmit={onSubmitHandler}
      className='min-h-[80vh] flex items-center justify-center'
    >
      <div className='flex flex-col gap-4 p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-xl bg-white'>
        <p className='text-2xl text-black font-semibold text-center'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p className='text-center text-gray-500 mb-2'>
          Please {state === 'Sign Up' ? 'Sign Up' : 'Log In'} to book an appointment
        </p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p className='font-medium'>Full Name</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1 focus:ring-2 focus:ring-primary outline-none'
              type='text'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className='w-full'>
          <p className='font-medium'>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1 focus:ring-2 focus:ring-primary outline-none'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <p className='font-medium'>Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1 focus:ring-2 focus:ring-primary outline-none'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        
        <button
          className='bg-primary text-white w-full py-2 rounded-md text-base font-medium hover:opacity-90 transition-all duration-200'
          type='submit'
        >
          {state === 'Sign Up' ? 'Create Account' : 'Log In'}
        </button>

       {/* Demo login */}
        <a
          href='#'
          onClick={handleDemoLogin}
          className='text-blue-600 text-center font-semibold underline hover:text-blue-700 transition-colors duration-200'
        >
           Login with Demo Account
        </a>

        {/* Switch between Login / Signup */}
        {state === 'Sign Up' ? (
          <p className='text-center mt-2'>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className='text-primary font-medium underline cursor-pointer hover:text-primary/80'
            >
              Login here
            </span>
          </p>
        ) : (
          <p className='text-center mt-2'>
            Don’t have an account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className='text-primary font-medium underline cursor-pointer hover:text-primary/80'
            >
              Create one
            </span>
          </p>
        )}
      </div>
    </form>
  )
}

export default Login
