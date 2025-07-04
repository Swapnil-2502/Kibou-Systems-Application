import React, { useEffect, useState } from 'react'

// type HeadProps = {
//   email?: string | null;
// }
//{email}: HeadProps
const HeaderComponent = () => {
  const [getemail,setgetEmail] = useState("");

  useEffect(()=>{
    setgetEmail(localStorage.getItem('email') || "Logged in")
  }, [])
  return (
    <>
      <h1 className="text-3xl font-bold mb-2 text-center">Tender Management Application</h1>
      {getemail ? <p className="text-center text-gray-600 mb-6">Logged in as: {getemail}</p>
      :null
      }
      
    </>
  )
}

export default HeaderComponent