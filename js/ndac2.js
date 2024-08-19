import password from "./data/ndac-password.js"

const ndac1Body = document.querySelector("body");
let isTime = false;

const passwordSplash = `
<div class="pass-background">
  <form class="pass-container" action="#">
    <p><span class="fa" style="font-size: 20px;">Navigating Distance and Closeness</span> will be available  from August 20th.<br/>If you have any difficulty accessing NDAC past this date, please contact us at our <a href="../9_contact.html">contact page</a></p>
    <p>Please enter the passphrase to access <span style="font-size: 18px; font-style: italic; font-weight: 600;">Navigating Distance and </br> Closeness</span></p>
    <input class="pass-field" id="pass-field" type="password" placeholder="Password">
    <input class="pass-submit-btn" type="submit" value="Submit">
    <a href="https://www.fable-arts.com" style="margin: 20px 0;">Return to homepage</a>
    </form>
</div>`;

const webpageBody = `
    `;


if (!isTime) { 
  ndac1Body.innerHTML = passwordSplash 
} else {
  ndac1Body.innerHTML = webpageBody;
}

const passForm = document.querySelector(".pass-container")
const passField = passForm.querySelector(".pass-field");
const submitBtn = passForm.querySelector(".pass-submit-btn");
console.log(passField.innerText);
submitBtn.addEventListener("click", (e) => {
  const userPassword = document.getElementById("pass-field").value.toLowerCase();
  if(userPassword != password) {
    passField.classList.add("wrong");
    passField.value = "";
    passField.placeholder = "Wrong password";
    submitBtn.value = "Please try again";
  } else {
    ndac1Body.classList.add("ndac-background");
    ndac1Body.classList.add("developing-background")
    ndac1Body.innerHTML = webpageBody;
  }
})
