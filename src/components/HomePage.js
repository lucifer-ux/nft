import React from 'react'
import DirectButton from '../components/PublicMint';
import PriorityButton from '../components/priorityButton';
import ReferralButton from '../components/referralButton';
import '../App.css';
import Faq from './Faq/Faq';

const HomePage = () => {
  return (
      <>
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