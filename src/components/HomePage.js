import React from 'react'
import DirectButton from '../components/PublicMint';
import PriorityButton from '../components/PriorityMint';
import ReferralButton from './ReferalMint';
import '../App.css';
import Faq from './Faq/Faq';
import Logo from './Logo/Logo';
import Banner from './Banner/Banner';

const HomePage = () => {
  return (
      <>
    <div className='navbar'>
    <Logo/>
    <Banner/>
    </div>
    <div className='buttons'>
      <ReferralButton/>
      <DirectButton/>
      <PriorityButton/>
    </div>
    <span className="flexBox">
    <Faq/>

    </span>
    </>
  )
}

export default HomePage