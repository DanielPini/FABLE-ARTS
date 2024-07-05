const form = document.getElementById('form');
const publicKey = yNVZUgWxbAhGcKpIN;
const serviceId = service_pziawpp;
const templateId = contact_form;
const username = form.getElementById('username');
const email = form.getElementById('email');
const subject = form.getElementById('subject');
const message = form.getElementById('message');
const submitBtn = form.getElementById('submit-btn');

email.js.init(publicKey);

form.addEventListener('submit', (e) => {
	e.preventDefault();
	submitBtn.innerText = "Just a moment...";
	checkInputs();
});

// Getall input field values
const inputFields = {
	name: nameInput.value,
	email: emailINput.value,
	message: messageInput.value
}
/*Send the email
(Add service, template ID and input field values)*/
emailjs.send(serviceID, templateID, inputFields)
	.then(() => {
		//Change button text
		submitBtn.innerText = "Message sent successfully";
		//Clear out all input fields
		nameInput.value = "";
		subjectInput.value = "";
		emailInput.value = "";
		messageInput.value = "";
	}, (error) => {
		//Console log the error
		console.log(error);
		//Change button text
		submitBtn.innerText = "Something went wrong";
	})


function checkInputs() {
	// trim to remove the whitespaces
	const usernameValue = username.value.trim();
	const emailValue = email.value.trim();
	const subjectValue = subject.value;
	const messageValue = message.value;
	
	if(usernameValue === '') {
		setErrorFor(username, 'Name cannot be blank');
	} else {
		setSuccessFor(username);
	}
	
	if(emailValue === '') {
        setErrorFor(email, 'Email cannot be blank');
	} else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Not a valid email');
	} else {
        setSuccessFor(email);
	}
    
    if(subjectValue === '') {
        setErrorFor(subject, 'Subject cannot be blank');
    } else {
        setSuccessFor(subject);
    }
	
	if(messageValue === '') {
		setErrorFor(message, 'Message cannot be blank');
	} else {
		setSuccessFor(message);
	}
}

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}
	
function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}
