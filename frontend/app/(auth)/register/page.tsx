"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import axios from "axios";
import Link from 'next/link';

const Register = () => {
  const [email,setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error,setError] = useState("")

  const router = useRouter()

  const handleRegister = async (e: React.FormEvent)=>{
    e.preventDefault();
    try{
      const res = await axios.post("http://localhost:3005/api/auth/register",{email,password})
      localStorage.setItem("email",res.data.user.email)
      localStorage.setItem("token",res.data.token)
      router.push("/dashboard");
    }
    catch(err:any){
      setError(err.response?.data?.error || "Something went wrong")
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-200'>
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className="border w-full px-4 py-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border w-full px-4 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 w-full"
          >
            Register
          </button>
           <p className="text-center">
            Not registered yet?{' '}
            <Link href="/login" className="text-green-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
    
  );
}

export default Register