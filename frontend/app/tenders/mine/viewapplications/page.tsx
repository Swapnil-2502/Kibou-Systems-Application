"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import HeaderComponent from "@/app/Components/HeaderComponent";

type Application = {
  application_id: number;
  message: string;
  budget: string;
  created_at: string;
  company_name: string;
  company_industry: string;
};

export default function TenderApplicationsPage() {
  const searchParams = useSearchParams();
  const tenderId = searchParams.get("id");

  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!tenderId) return;

    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`http://localhost:3005/api/applications/tender/${tenderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.applications);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    };

    fetchApplications();
  }, [tenderId]);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <HeaderComponent />
      <h2 className="text-2xl font-bold mb-4">Applications for Tender #{tenderId}</h2>

      {applications.length === 0 ? (
        <p className="text-gray-600">No applications yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app.application_id} className="p-4 border mb-4 rounded shadow">
            <p className="text-lg font-semibold">{app.company_name}</p>
            <p className="text-sm text-gray-500 mb-1">Industry: {app.company_industry}</p>
            <p><strong>Budget:</strong> ₹{app.budget}</p>
            {app.message && (
              <p className="mt-1"><strong>Message:</strong> {app.message}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Applied on: {new Date(app.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
