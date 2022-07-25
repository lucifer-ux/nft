import React, { useState } from 'react';
import "./RedirectForm.css"
let formElements = [{
  label: "token id",// check
  key: 'tokenId'
}, {
  label: "minting price",// minbalance above check
  key: 'mintingPrice'
}, {
  label: "referral code",
  key: 'referalCode'
}]

 function RedirectForm() {
  const [formData, setFormData] = useState({});

  const handleChange = (value, key) => {
    setFormData({ ...formData, ...{ [key]: value } });
  }

  const submit = () => {
    if (isFormInValid()) {
      return
    }
    alert(JSON.stringify(formData))
    console.log(formData.tokenId)
  }

  const isFormInValid = () => {
    let returnValue = false;
    formElements.forEach(formElement => {
      if (formData[formElement.key] === undefined || formData[formElement.key] === "") {
        alert(formElement.label + " is Missing");
        returnValue = true
      }
    })
    return returnValue
  }

  return (
    <div className="login-container">
      <form className='form-login'>
        {formElements.map(formElement => {
        return <div>
          <label className='login__label'>{formElement.label}</label>
          <input className='login__input' value={formData[formElement.key]}
            onChange={(e) => { 
            handleChange(e.target.value, formElement.key) }}/>
            </div>
      })}
        <button className='login__submit' onClick={(e) => { e.preventDefault(); submit() }}>submit</button>
      </form>
    </div>
  );

}
export default RedirectForm