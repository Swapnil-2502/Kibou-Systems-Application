"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const LogoutComponent = () => {
    const router = useRouter()
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("email")
        router.push("/login")
    }
  return (
     <button
        className="bg-red-500 text-white px-3 py-1 rounded  ml-20 cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </button>
  )
}

export default LogoutComponent