import React from 'react'
import LogoImage from '../resources/ChadLogo.png'
import "./Logo.css"
const Logo = () => {
  return (
    <>
    <div className='wrap-image'>
    <img src={LogoImage} alt="Logo" className='logo'/>
    </div>
    </>
  )
}

export default Logo