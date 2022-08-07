import React from 'react'

const Element = (props) => {
  return (
    <div>
        <div className="swiper-slide">
          <div className="container-general">
            <div className={props.name}>
              <div className="item"></div>
              <div className="item"></div>
              <div className="item"></div>
              <div className="item"></div>
              <div className="item"></div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Element