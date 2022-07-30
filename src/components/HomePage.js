import React from 'react'
import DirectButton from '../components/PublicMint';
import PriorityButton from '../components/PriorityMint';
import ReferralButton from './ReferalMint';
import '../App.css';
import Faq from './Faq/Faq';
import Logo from './Logo/Logo';
import Banner from './Banner/Banner';
import GenerateReferal from './GenerateReferal';

const HomePage = (props) => {
  return (
      <>
      <div className="bg"></div>
<div className="bg bg2"></div>
<div className="bg bg3"></div>  
    <div className='navbar'>
    <Logo className= "content"/>
    <Banner className = "content"/>
    </div>
    <div className='buttons'>
      <ReferralButton className="content" setState = {props.setState}/>
      <DirectButton className="content"/>
      <PriorityButton className="content" setState = {props.setState}/>
      <GenerateReferal className="content" setState = {props.setState}/>
    </div>
    <span className="flexBox">
    <Faq className="content"/>

    </span>
    </>
  )
}

export default HomePage