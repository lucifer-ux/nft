import React from 'react'
import "./Button.css"



const FancyButton = (props) => {

return(
  <>
<div className="wrap">
  <button className="button">{props.buttonText}</button>
</div>  </>
)

}

  
    export default FancyButton
