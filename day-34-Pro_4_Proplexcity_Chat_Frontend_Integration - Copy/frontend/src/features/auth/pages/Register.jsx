import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const user = useSelector(select => select.auth.user);
  const loading = useSelector(select => select.auth.loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup Data:", { username, email, password });
    try {
      console.log("HEllo");
      await handleRegister({email, username, password});
      
      setEmail("");
      setPassword("");
      setUsername("");

    } catch (error) {
      console.log(error);
    }
  };

  if(!loading && user){
    return <Navigate to={'/'} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-black/60 backdrop-blur-md border border-red-500/20 text-white"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          Create Account
        </h2>

        <h2 className="text-sm font-simebold text-center mb-4 text-gray-300">
            Start your journey with us
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-400">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-1 text-sm text-gray-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90 transition font-semibold"
        >
          Sign Up
        </button>

        {/* Navigate to Login */}
        <p className='text-center mt-4 text-sm text-gray-400'>Already have an account. <Link className='text-blue-400 font-normal' to={'/login'}>Login</Link> </p>
      </form>
    </div>
  );
}

export default Register