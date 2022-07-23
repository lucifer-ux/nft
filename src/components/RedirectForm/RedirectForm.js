import React, { useState } from 'react';

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
      if (formData[formElement.key] === undefined) {
        alert(formElement.label + " is Missing");
        returnValue = true
      }
    })
    return returnValue
  }

  return (
    <div className="App">
      <form>
        Form goes here
        {formElements.map(formElement => {
        return <div>
          {formElement.label}
          <input value={formData[formElement.key]}
            onChange={(e) => { 
            handleChange(e.target.value, formElement.key) }}/>
            </div>
      })}
        <button onClick={(e) => { e.preventDefault(); submit() }}>submit</button>
      </form>
    </div>
  );

}
export default RedirectForm