// Script.js 
function validate() { 
  const form = document.querySelector('.contact-form')
  let name = 
      form.getElementById("name").value; 
  let subject = 
      form.getElementById("subject").value; 
  let email = 
      form.getElementById("email").value; 
  let message = 
      form.getElementById("message").value; 
  let error_message = 
      form.getElementById("error_message"); 

  error_message.style.padding = "10px"; 

  let errors = []; 

  if (name.length < 4) { 
      errors.push("Please Enter a valid Name");} 
  if (subject.length < 8) { 
      errors.push("Please Enter a Correct Subject");} 
  if (email.indexOf("@") == -1 || email.length < 6) { 
      errors.push( 
          "Please Enter a valid Email");} 
  if (message.length <= 40) { 
      errors.push( 
          "Please Enter More Than 40 Characters");} 
  if (errors.length > 0) { 
      error_message.innerHTML = 
          errors.join("<br>"); 
      return false;} 
  else { 
      alert( 
          "Form Submitted Successfully!"); 
      return true;}}