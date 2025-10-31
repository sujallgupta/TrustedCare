import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';



const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
 
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}api/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem('aToken', data.token);
          toast.success(data.message);
          setAToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}api/doctor/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem('dToken', data.token);
          toast.success(data.message);
          setDToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  //  Demo Login Function
  const handleDemoLogin = async (e) => {
    e.preventDefault();

    const demoCredentials =
      state === 'Admin'
        ? { email: 'admin@trustedcare.com', password: 'admin123' }
        : { email: 'demo@trustedcare.com', password: '@Demo123' };
         toast.success(`Logged in as Demo ${state} Account`);


    try {
      const endpoint =
        state === 'Admin'
          ? `${backendUrl}api/admin/login`
          : `${backendUrl}api/doctor/login`;

      const { data } = await axios.post(endpoint, demoCredentials);

      if (data.success) {
        if (state === 'Admin') {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
        } else {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
        }
        toast.success(`Logged in as Demo ${state}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Demo login failed');
      console.error('Demo login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 w-[90%] max-w-sm p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="logo.png" alt="App Logo" className="w-14 h-14 object-contain" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          <p>
            <span className="text-blue-500">{state}</span> Login
          </p>
        </h2>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <input
              onChange={(e) => SetEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="trustedCare@example.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <input
              onChange={(e) => SetPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all shadow-sm hover:shadow-md mt-2"
          >
            Sign In
          </button>

          {/* demo login */}
          {state === 'Admin' ?   (
  <p className="text-center text-sm text-gray-600 mt-2">
    Login with Demo Admin Account?{' '}
    <span
      className="text-blue-600 font-medium hover:underline cursor-pointer"
      onClick={handleDemoLogin}
      
    >
      Click Here
    </span>
    
  </p>
) :  (
  <p className="text-center text-sm text-gray-600 mt-2">
    Login with Demo Doctor Account?{' '}
    <span
      className="text-blue-600 font-medium hover:underline cursor-pointer"
      onClick={handleDemoLogin}
    >
      Click Here
    </span>
  </p>
)}


          {state === 'Admin' ? (
            <p className="text-center text-sm text-gray-600 mt-2">
              Doctor Login?{' '}
              <span
                className="text-blue-600 font-medium hover:underline cursor-pointer"
                onClick={() => setState('Doctor')}
              >
                Click Here
              </span>
            </p>
          ) : (
            <p className="text-center text-sm text-gray-600 mt-2">
              Admin Login?{' '}
              <span
                className="text-blue-600 font-medium hover:underline cursor-pointer"
                onClick={() => setState('Admin')}
              >
                Click Here
              </span>
            </p>
          )}
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} TrustedCare {state} Console
        </p>
      </div>
    </div>
  );
};

export default Login;
