"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import HeaderComponent from "@/app/Components/HeaderComponent";

export default function ApplicationForm() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const tenderId = searchParams.get("id");

    const [message, setMessage] = useState("");
    const [budget, setBudget] = useState("");

   

    useEffect(()=>{
        if(!tenderId) {
            toast.error("Missing tender ID");
            router.push("/tenders");
        }

        
    },[tenderId,router])

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        try{
            await axios.post("http://localhost:3005/api/applications",
                {
                    tender_id: Number(tenderId),
                    message,
                    budget: Number(budget)
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            toast.success("Application submitted!");
            router.push("/tenders");
        }
        catch(error){
            const err = error as AxiosError
            console.error("Error submitting application:", err.response?.data || err.message);
            toast.error("Failed to apply");
        }

    }

    return(
        <>  
            <div className='mt-10'>
                <HeaderComponent />
            </div>
            <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Apply to Tender #{tenderId}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                    placeholder="Your message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 border rounded"
                    />
                    <input
                    type="number"
                    placeholder="Proposed Budget (₹)"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                    />
                    <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Submit Application
                    </button>
                    </div>
                </form>
            </div>
        </>
    )
}