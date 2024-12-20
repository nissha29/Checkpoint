import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import axios from 'axios'
import URL from '../../constants.js'
import { AuthContext } from "../Context/AuthContext.jsx";

const Signup = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (e)=>{
    setError('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setError('');
    try{
      const response = await axios.post(
        `${URL}/user/signup`,
        formData,
        {
          withCredentials: true
        }
      )
      let username = response.data.name
      let email = response.data.email
      signIn({
        username,
        email
      })
      navigate("/dashboard", {
        state: {
          name: username,
          email: email
        }
      })
    }catch(err) {
      
      if (err.response) {
        if (err.response.status === 400) {
          setError('Please provide input values in correct format');
        } else if (err.response.status === 409) {
          setError('User already exists');
        } else if (err.response.status === 500) {
          setError('Server error');
        } else {
          setError(err.response.data.message || 'An error occurred');
        }
      }
    }
  }



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070a13] p-4">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-white text-center mb-8"
      >
        Sign up to CheckPoint
      </motion.h1>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md z rounded-lg border border-slate-700 shadow-2xl shadow-black/50 overflow-hidden"
      >
        <div className="p-8">
          {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center bg-red-600/20 border border-red-600/50 text-red-300 p-3 rounded-md mb-6 space-x-2"
                >
                <AlertTriangle className="text-red-500" />
                <p className="text-sm">{error}</p>
              </motion.div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-md font-medium text-slate-200">
                Full Name
              </label>
              <div className="flex items-center border border-slate-600 rounded-md focus-within:border-slate-400 transition-colors duration-300">
                <User className="m-2 text-slate-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="user name"
                  className="w-full px-2 py-2 outline-none text-lg bg-transparent text-white placeholder-slate-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-md font-medium text-slate-200">
                Email
              </label>
              <div className="flex items-center border border-slate-600 rounded-md focus-within:border-slate-400 transition-colors duration-300">
                <Mail className="m-2 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  autoComplete="user email"
                  className="w-full px-2 py-2 outline-none text-lg bg-transparent text-white placeholder-slate-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-md font-medium text-slate-200">
                Password
              </label>
              <div className="flex items-center border border-slate-600 rounded-md focus-within:border-slate-400 transition-colors duration-300">
                <Lock className="m-2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="user password"
                  className="w-full px-2 py-2 outline-none text-lg bg-transparent text-white placeholder-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="m-2 focus:outline-none hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="text-slate-400 hover:text-slate-300" />
                  ) : (
                    <Eye className="text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-[0.9rem] text-slate-400 mt-1">
                Password must have: 8-50 chars, with lowercase, uppercase, number, and special character
              </p>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto px-6 py-2 bg-[#18294d] text-white rounded-md hover:bg-[#18295dd8] transition-colors duration-300 text-lg font-semibold"
                type="submit"
              >
                Sign Up
              </motion.button>
              <NavLink
                  to={"/signin"}
                  className="text-slate-200 hover:text-white hover:underline transition-colors duration-300"
                >
                  Already have an account?
                </NavLink>
            </div>
          </form>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 w-full max-w-md"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={()=>{
            navigate("/")
          }}
          className="w-full px-6 py-2 bg-[#18294d] text-white rounded-md hover:bg-[#18295dd8] transition-colors duration-300 text-lg font-semibold"
        >
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Signup;