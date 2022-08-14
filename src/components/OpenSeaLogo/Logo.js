import React from 'react'
import LogoImage from '../resources/OpenSeaLogo.png'
import "./Logo.css"
const OpenSeaLogo = () => {
  return (
    <>
    <a href="https://opensea.io/collection/ddw-chad-card" target="_blank" rel="noopener noreferrer">
    <img src={LogoImage} alt="Logo" className='openSeaLogo'/>
    </a>
    </>
  )
}

export default OpenSeaLogo