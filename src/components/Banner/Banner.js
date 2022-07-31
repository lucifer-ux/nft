import React from 'react'
import BannerImage from '../resources/Banner.png'
import './Banner.css'
const Banner = () => {
  return (
    <>
        <img src={BannerImage} alt="Banner" className='bannerImage'/>
    </>
  )
}

export default Banner