import React from "react";
import "./ErrorModal.css";
import copy from "copy-to-clipboard";
import { useState } from "react";

function ErrorModal(props) {
  const [copyButtonText, setCopyButtonText] = useState("Copy")
  const copyToClipboard = () => {
    copy(props.copyText);
    alert(`You have copied "${props.copyText}"`);
    setCopyButtonText("Copied")
 }
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
        <a className={ props.transactionMessageDisplay ? "clipboard" : "no-clipboard"} >click here to copy credentials
        <button className="button-copied" onClick={copyToClipboard}> {copyButtonText}</button></a>
        <div className="footer">
        <a target={props.linkFailure ? "" : "_blank"} href={props.link}>
          <button
          onClick={()=> props.setErrorModalValue(false)}>
           {props.buttonText}
          </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;