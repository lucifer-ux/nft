import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
const ProtectedRoute = (props) => {
    let auth = props.state
  return (
   auth ? <Outlet/> : <Navigate to="/"/>
  )
}

export default ProtectedRoute