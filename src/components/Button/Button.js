import React from "react";
import "./Button.css";

const FancyButton = (props) => {
  return (
    <>
      <div className="wrap">
        <button
          className={!props.isButtonActive ? "button-disabled" : "button"}
          id="button"
          disabled={!props.isButtonActive}
        >
          {props.buttonText}
        </button>
      </div>{" "}
    </>
  );
};

export default FancyButton;
