import React from 'react'
import DirectButton from '../components/PublicMint';
import PriorityButton from '../components/priorityButton';
import ReferralButton from '../components/referralButton';
import '../App.css';
import  Button  from "./Button/Button";
import Faq from './Faq';

const HomePage = () => {
  return (
      <>
    <div className='flexBox'>
      <ReferralButton/>
      <DirectButton/>
      <PriorityButton/>
        <Button/>
    </div>
    </>
  )
}

export default HomePage