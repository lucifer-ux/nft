import React from 'react'
import { useState} from "react";
import smaple from './background.mp4'
import MuteButton from '../MuteButton/muteButton';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'


library.add(faVolumeMute, faVolumeUp)
const VideoPlayer = () => {
  const [isMuted, setIsMuted] = useState(true);
  const toggleMute = () => {var vid = document.getElementsByClassName('videoTag')[0];
  console.log(vid, "mute toggled")
  vid.muted = !vid.muted
  setIsMuted(vid.muted)}
  return (
    <>
    <video className='videoTag' playsInline autoPlay loop muted
    style={{
      position: "absolute",
      width: "100%",
      left: "50%",
      top: "50%",
      height: "100%",
      objectFit: "cover",
      transform: "translate(-50%,-50%)",
      zIndex: "-1",
      opacity: "0.45"
    }}
    >
    <source src={smaple} type='video/mp4' />
    </video>
    <MuteButton isMuted={isMuted} _toggleMuteButton={toggleMute}/>
    </>
  )
}

export default VideoPlayer