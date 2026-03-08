import React, { ReactNode } from 'react'

const AuthLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='auth-layout w-full h-screen ' >
      {children}
    </div>
  )
}

export default AuthLayout
