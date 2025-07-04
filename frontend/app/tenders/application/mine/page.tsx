"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import HeaderComponent from "@/app/Components/HeaderComponent";

type Application = {
  application_id: number;
  tender_id: number;
  title: string;
  description: string;
  deadline: string;
  tender_budget: number;
  message: string;
  budget: number;
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:3005/api/applications/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.applications);
      } catch (err) {
        console.error("Error fetching applications:", err);
        toast.error("Failed to load your applications");
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <HeaderComponent />
      <h2 className="text-2xl font-bold mb-6">Tenders You&#39;ve Applied To</h2>
      {applications.length === 0 ? (
        <p className="text-gray-600">No applications submitted yet.</p>
      ) : (
        applications.map((app) => (
          <div
            key={app.application_id}
            className="mb-4 p-4 border rounded shadow-sm"
          >
            <h3 className="font-semibold text-lg">{app.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{app.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              Deadline: {app.deadline.split("T")[0]} | Tender Budget: ₹{app.tender_budget}
            </p>
            <p><strong>Your Proposal:</strong> ₹{app.budget}</p>
            {app.message && <p><strong>Message:</strong> {app.message}</p>}
          </div>
        ))
      )}
    </div>
  );
}
