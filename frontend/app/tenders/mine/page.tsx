"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TenderCard from "../../Components/TenderCard"
import axios from "axios";
import toast from "react-hot-toast";
import HeaderComponent from "@/app/Components/HeaderComponent";

type Tender = {
  id: number;
  company_id:number,
  title: string;
  description: string;
  deadline: string;
  budget: string;
  created_at: string;
};

export default function MyTenders(){
  const [tenders, setTenders] = useState<Tender[]>([]);
  const router = useRouter();

  useEffect(()=>{
    const fetchTenders = async ()=>{
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try{
        const res = await axios.get("http://localhost:3005/api/tender/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTenders(res.data.tenders);
      }
      catch(err){
        console.log("Error->",err)
        toast.error("Failed to load your tenders");
      }
    }
    fetchTenders();
  },[router])

  const handleEdit = (id: number) => {
    router.push(`/tenders/form/?id=${id}`);
  };

  const handleViewApplications = (id: number) => {
    router.push(`/tenders/mine/viewapplications?id=${id}`);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this tender?")) return;

    try{
      await axios.delete(`http://localhost:3005/api/tender/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Tender deleted");
      setTenders(tenders.filter((t) => t.id !== id));
    }
    catch(error){
      console.log("Error->",error)
      toast.error("Failed to delete tender");
    }
  }

  return (
    <>
      <div className='mt-10'>
        <HeaderComponent />
      </div>
   
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">My Tenders</h2>
        {tenders.length === 0 ? (
          <p className="text-gray-600">No tenders created yet.</p>
        ) : (
          tenders.map((tender) => (
            <TenderCard
              key={tender.id}
              tender={tender}
              onEdit={handleEdit}
              onViewApplications={handleViewApplications}
              onDelete={handleDelete}
            />
          ))
        )}
    </div>
     </>
  )
} 

