"use client"
import React from 'react'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderComponent from '../Components/HeaderComponent';
import axios from 'axios';
import supabase from '@/lib/supabase';
import toast from "react-hot-toast";
import { AxiosError } from "axios";

type CompanyForm = {
    name: string,
    industry: string,
    description: string,
    logo_url?: string 
}

type Company = {
    id: number,
    user_id: number,
    name: string,
    industry: string,
    description: string,
    logo_url?: string 
}

const Company = () => {
    const router = useRouter();
    const [form, setForm] = useState<CompanyForm>({
        name:"",
        industry:"",
        description:""
    })
    const [company, setCompany] = useState<Company | null>(null)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token){
            router.push("/login")
            return 
        }

        const fetchCompany = async ()=>{
            try{
                const res = await axios.get("http://localhost:3005/api/company/me",{
                    headers: { Authorization: `Bearer ${token}` }
                })

                setCompany(res.data.company)
                //console.log("company data -> ",res.data.company)
                if(res.data.company){
                    setForm({
                        name: res.data.company.name,
                        industry: res.data.company.industry,
                        description: res.data.company.description,
                        logo_url: res.data.logo_url
                    });
                    setIsEditing(true)
                }
            }
            catch(err){
                console.log("Error -> ", err)
                console.log("No existing company profile");
            }
            finally{
                setLoading(false);
            }
        }
        fetchCompany();
    },[router])

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        const token = localStorage.getItem("token")
        if(!token){
           return router.push("/login")  
        }

        let logoURL = form.logo_url || "";
        console.log(logoFile)
        if(logoFile){
            const fileExt = logoFile.name.split(".").pop()
            console.log("fileExt => ", fileExt)
            const fileName = `logo-${Date.now()}.${fileExt}`
            console.log("fileName => ", fileName)
            const {data,error} = await supabase.storage
                    .from('company-logos')
                    .upload(fileName,logoFile,{
                        cacheControl:"3600",
                        upsert:false,
                        contentType: logoFile.type,
                    })
            console.log("data path -> ",data?.path)
            if(error){
                console.error("Upload error", error);
                return 
            }

            const {data: publicUrlData} = supabase.storage
                .from("company-logos")
                .getPublicUrl(data.path)

            logoURL = publicUrlData.publicUrl;
        } 
        
        const payload = {
            ...form,
            logo_url: logoURL
        }

        try{
             if(isEditing && company){
                await axios.put(`http://localhost:3005/api/company/${company.id}`,payload,{
                    headers: {Authorization: `Bearer ${token}`}
                })
                toast.success("Company profile updated!");
            }else{
                await axios.post("http://localhost:3005/api/company",payload,{
                    headers: {Authorization: `Bearer ${token}`}
                })
                toast.success("Company profile created!");
            }

            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
        }
        catch(err){
            const error = err as AxiosError
            console.error("Failed to save company:", error.response?.data || error.message);
            toast.error("Failed to save company");
        }
       
    }

    if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <HeaderComponent />
            <h1 className="text-2xl font-bold mb-4 mt-10">
                {isEditing ? "Edit Company Profile" : "Create Company Profile"}
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    className="border rounded-xl w-full px-4 py-2"
                    type="text"
                    placeholder='Company Name'
                    value={form.name}
                    onChange={(e)=>setForm({...form, name: e.target.value})}
                />
                <input
                    className="border rounded-xl w-full px-4 py-2"
                    type="text"
                    placeholder='Industry'
                    value={form.industry}
                    onChange={(e)=>setForm({...form, industry: e.target.value})}
                />
                <textarea
                    className="border rounded-xl w-full px-4 py-2"
                    rows={4}
                    placeholder='Description'
                    value={form.description}
                    onChange={(e)=>setForm({...form, description: e.target.value})}
                />
                <div>
                    <label className="block font-medium mb-1">Company Logo:</label>
                    <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            setLogoFile(file || null);
                            if(file) setPreviewUrl(URL.createObjectURL(file));
                        }}
                    />
                    {previewUrl && (
                        <img src={previewUrl} alt="Preview" className="h-24 mt-2 rounded" />
                    )}
                </div>
                <button 
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {isEditing ? "Update Profile" : "Create Profile"}
                </button>
            </form> 
        </div>
    </>
  )
}

export default Company