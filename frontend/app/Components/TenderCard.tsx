import React from "react";

type Tender = {
    id: number;
    company_id: number,
    title: string;
    description: string;
    deadline: string;
    budget: string;
    created_at?: string;
}

type Props = {
  tender: Tender;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  Apply?: (id:number) => void;
  myCompanyId?: number | null;
  appliedTenderIds?: number[];
  onViewApplications?: (id: number) => void; 
};

const TenderCard: React.FC<Props> = ({tender, onEdit, onDelete, Apply, myCompanyId, appliedTenderIds, onViewApplications}) => {
    return (
        <div className="border rounded p-4 mb-4 shadow hover:shadow-md transition">
            <div className="flex justify-between items-center mb-2">

                <h3 className="text-lg font-bold">{tender.title}</h3>

                <div className="flex gap-2">
                    {onEdit && (
                        <button
                            onClick ={() => onEdit(tender.id)}
                            className="text-blue-500 hover:underline cursor-pointer"
                        >
                            Edit
                        </button>
                    )}
                    {onViewApplications && (
                        <button
                            onClick={() => onViewApplications(tender.id)}
                            className="text-blue-600 hover:underline ml-2 cursor-pointer"
                        >
                            View Applications
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(tender.id)}
                            className="text-red-500 hover:underline cursor-pointer"
                        >
                            Delete
                        </button>
                    )}
                    {Apply && (
                        myCompanyId === tender.company_id ? (
                            <button
                            disabled
                            className="text-gray-500 cursor-not-allowed"
                            >
                            Cannot Apply
                            </button>
                        ) : appliedTenderIds?.includes(tender.id) ? (
                            <span className="text-green-600 font-semibold">Applied</span>
                        ) : (
                            <button
                            onClick={() => Apply(tender.id)}
                            className="text-amber-700 hover:underline cursor-pointer"
                            >
                            Apply
                            </button>
                        )
                    )}
                </div>
            </div>
                <p className="text-gray-700">{tender.description}</p>
                <div className="mt-2 text-sm text-gray-600">
                    <div>Deadline: {tender.deadline.split("T")[0]}</div>
                    <div>Budget: ₹{tender.budget}</div>
                    {tender.created_at && (
                        <div className="text-xs mt-1">Created: {new Date(tender.created_at).toLocaleDateString()}</div>
                    )}
                </div>
        </div>
    )
}

export default TenderCard;