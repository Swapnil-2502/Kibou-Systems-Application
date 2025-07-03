import React from 'react'

type HeadProps = {
  email?: string | null;
}

const HeaderComponent = ({email}: HeadProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2 text-center">Tender Management Application</h1>
      {email ? <p className="text-center text-gray-600 mb-6">Logged in as: {email}</p>
      :null
      }
      
    </>
  )
}

export default HeaderComponent