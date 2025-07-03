"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import HeaderComponent from '../Components/HeaderComponent';
import LogoutComponent from '../Components/LogoutComponent';

type Company = {
  id: number,
  name: string,
  industry: string,
  description: string,
  logo_url: string
}

const Dashboard = () => {
  const router = useRouter()
  
  const [loading,setLoading] = useState(true)
  const [company,setCompany] = useState<Company | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(()=>{
    const token = localStorage.getItem("token")

    if(!token){
      router.push('/login')
      return 
    }

    const fetchCompany = async() => {
      try{
        const res = await axios.get("http://localhost:3005/api/company/me",{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })

        setCompany(res.data.company)

        setEmail(localStorage.getItem("email") || "Logged in");

      }
      catch(error: unknown){
        console.error("Unauthorized or error:", error);

        if (axios.isAxiosError(error) && error.response) {
          if(error.response.status === 401){
            localStorage.removeItem("token"); //If token is invalid or expired
            router.push("/login");
          }
          else if(error.response.status === 404){
            setCompany(null)
            setEmail(localStorage.getItem("email") || "Logged in");
          }
          else{
            alert("Something went wrong fetching company info.");
          }
        } else {
          alert("Something went wrong fetching company info.");
        }
      }
      finally{
        setLoading(false);
      }
    }
    fetchCompany();
  },[router])

  const handleCreateOrEdit = () => {
    router.push("/company");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
    <LogoutComponent />
    <div className="max-w-3xl mx-auto mt-10 px-4">
     
      <HeaderComponent email={email} />

      {company ? (
        <div className="border rounded-xl p-6 shadow-md mt-40">
          <div className="flex items-start gap-6">
      
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{company.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{company.industry}</p>
              <p className="mb-4">{company.description}</p>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={handleCreateOrEdit}
              >
                Edit Profile
              </button>
            </div>

           
            {company.logo_url && (
              <img
                src={company.logo_url}
                alt="Company Logo"
                className="h-44 w-44 object-fill rounded-md"
              />
            )}
          </div>
        </div>

      ) : (
        <div className="text-center mt-20">
          <p className="mb-4">You have not created a company profile yet.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleCreateOrEdit}
          >
            Create Company Profile
          </button>
        </div>
      )}
    </div>

    </>
  );
}

export default Dashboard