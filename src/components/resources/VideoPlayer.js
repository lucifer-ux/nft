import React from 'react'
import smaple from '../resources/background.mp4'
const VideoPlayer = () => {
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
    </>
  )
}

export default VideoPlayer