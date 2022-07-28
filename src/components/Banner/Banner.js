import React from 'react'
import BannerImage from '../resources/Banner.png'
import './Banner.css'
const Banner = () => {
  return (
    <div className>
        <img src={BannerImage} alt="Banner" className='bannerImage'/>
    </div>
  )
}

export default Banner