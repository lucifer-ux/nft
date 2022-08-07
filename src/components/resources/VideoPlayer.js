import React from 'react'
import smaple from './lucifer.mp4'
const VideoPlayer = () => {
  return (
    <>
    <video className='videoTag' autoPlay loop muted>
    <source src={smaple} type='video/mp4' />
    </video>
    </>
  )
}

export default VideoPlayer