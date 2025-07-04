'use client'
import HeaderComponent from '@/app/Components/HeaderComponent'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";

const TenderForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  console.log("ID->", id)
  console.log("searchParams->", searchParams)
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    budget: "",
  });
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const id = searchParams.get("id") as number | null;
   
    if(id){
      setIsEditing(true);

      axios.get(`http://localhost:3005/api/tender/${id}`,{
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res)=>{
          const t = res.data.tender;
            setForm({
            title: t.title,
            description: t.description,
            deadline: t.deadline.split("T")[0], // format as YYYY-MM-DD
            budget: t.budget,
          });
        }).catch(() => {
          toast.error("Error loading tender");
          router.push("/tenders/mine");
        })
        .finally(() => setLoading(false));
    }
    else{
      setLoading(false)
    }

    
  },[router, searchParams])

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try{
      const id = searchParams.get("id") as string | null;
      const endpoint = isEditing ? `http://localhost:3005/api/tender/${id}`: "http://localhost:3005/api/tender"
      const method = isEditing ? "put" : "post";

      await axios[method](endpoint,form,{
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(`Tender ${isEditing ? "updated" : "created"} successfully!`);
      router.push("/tenders/mine");
    }
    catch(err){
       const error = err as AxiosError
      console.error("Tender submit error:", error.response?.data || error.message);
      toast.error("Failed to save tender.");
    }
  }


  return (
    <>
      <div className='mt-10'>
        <HeaderComponent />
      </div>
      
      <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit" : "Create"} Tender</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input 
            name="title"
            value={form.title}
            placeholder='Title'
            className="w-full p-2 border rounded"
            required
            onChange={handleChange}
          />
          <textarea 
            name='description'
            value={form.description}
            placeholder='description'
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
          <input 
            type='date'
            name='deadline'
            value={form.deadline}
            onChange={handleChange}
            placeholder='deadline'
            className="w-full p-2 border rounded"
            required
          />
          <input 
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
          >
            {isEditing ? "Update": "Create"}
          </button>
        </form>
      </div>
    </>
  )
}

export default TenderForm