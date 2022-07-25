import React from 'react'
import "./Faq.css"
const Faq = () => {
  return (
    <> 
    <h1>FAQ</h1>

<details itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
  <summary itemProp="name">A question about something</summary>
    <div className="details-expanded" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
    <p>The answer about this has some points to make:</p>
    <ol>
    <li>Do this and then</li>
    <li>The next step</li>
    <li>Almost there</li>
    <li>Yes, this is it</li>
    <li>There is no step 5</li>
    </ol>
  </div>
</details>

<details itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
  <summary itemProp="name">Summary</summary>
  <div className="details-expanded" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
    <h2>Test headline</h2>
    <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    </ul>
  </div>
</details>
<details itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
  <summary itemProp="name">Summary</summary>
    <div className="details-expanded" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
    <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    </ul>
  </div>
</details>
<details itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
  <summary itemProp="name">Summary</summary>
    <div className="details-expanded" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
    <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    </ul>
  </div>
</details>
<details itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
  <summary itemProp="name">Summary</summary>
    <div className="details-expanded" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
    <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    </ul>
  </div>
</details>
    </>
  )
}

export default Faq