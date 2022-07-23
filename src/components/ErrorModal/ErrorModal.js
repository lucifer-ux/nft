import React from "react";
import "./ErrorModal.css";

function ErrorModal(props) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
          onClick={()=> props.setErrorModalValue(false)}
          >
            X
          </button>
        </div>
        <div className="title">
          <h3>{props.text}</h3>
        </div>
        <div className="body">
          <p>{props.body}</p>
        </div>
        <div className="footer">
          <button
          onClick={()=> props.setErrorModalValue(false)}>
           {props.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;