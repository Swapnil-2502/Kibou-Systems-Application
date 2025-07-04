"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TenderCard from "../Components/TenderCard"
import axios from "axios";
import toast from "react-hot-toast";
import HeaderComponent from "@/app/Components/HeaderComponent";

type Tender = {
  id: number;
  company_id: number,
  title: string;
  description: string;
  deadline: string;
  budget: string;
  created_at: string;
};

export default function MyTenders(){
  const [tenders, setTenders] = useState<Tender[]>([]);
  const router = useRouter();

  const [appliedTenderIds, setAppliedTenderIds] = useState<number[]>([]);
  const [myCompanyId, setMyCompanyId] = useState<number | null>(null);

  useEffect(()=>{

    const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
          const [tendersRes, companyRes, applicationsRes] = await Promise.all([
            axios.get("http://localhost:3005/api/tender/", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:3005/api/company/me", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:3005/api/applications/mine", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setTenders(tendersRes.data.tenders);
          setMyCompanyId(companyRes.data.company.id);
          type Application = { tender_id: number };
          setAppliedTenderIds(applicationsRes.data.applications.map((app: Application) => app.tender_id));

          console.log(applicationsRes)

        } catch (err) {
          console.error("Error loading data:", err);
          toast.error("Failed to load tenders or company info");
        }
      };

    fetchData();
  },[])

  const handleapply = (id: number) =>{
    router.push(`/tenders/application/form/?id=${id}`);
  }

  return (
    <>
      <div className='mt-10'>
        <HeaderComponent />
      </div>
   
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">All Tenders</h2>
        {tenders.length === 0 ? (
          <p className="text-gray-600">No tenders created yet.</p>
        ) : (
          tenders.map((tender) => (
            <TenderCard
              key={tender.id}
              tender={tender}
              Apply={handleapply}
              myCompanyId={myCompanyId}
              appliedTenderIds={appliedTenderIds}
            />
          ))
        )}
    </div>
     </>
  )
} 

