const form = document.getElementById('form');
const publicKey = "yNVZUgWxbAhGcKpIN";
const serviceID = "service_pziawpp";
const templateID = "contact_form";
const username = document.getElementById('username');
const email = document.getElementById('email');
const subject = document.getElementById('subject');
const message = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');
const subscribe = document.getElementById('subscribe');

let subscribeConsent = ""

subscribe.addEventListener("click", () => {
	if(subscribe.checked) {
		subscribeConsent = "Subscribe me please!";
	} else {
		subscribeConsent = "No subscription needed.";
	}
});

(function() {
	// https://dashboard.emailjs.com/admin/account
	emailjs.init({
		publicKey: publicKey,
	});
})();

let userSuccess, emailSuccess, subjectSuccess, messageSuccess;

submitBtn.disabled = true;
userSuccess = false;
emailSuccess = false;
subjectSuccess = false;
messageSuccess = false;

username.addEventListener('input', (e) => {
	checkUsername(e)
	isVerified()
})
email.addEventListener('input', (e) => {
	checkEmail(e)
	isVerified()
})
subject.addEventListener('input', (e) => {
	checkSubject(e)
	isVerified()
})
message.addEventListener('input', (e) => {
	checkMessage(e)
	isVerified()
})
function isVerified() {
	if (userSuccess && emailSuccess && subjectSuccess && messageSuccess) {
		submitBtn.disabled = false;
	} else { submitBtn.disabled = true; }
}


form.addEventListener("submit", (e) => {
	e.preventDefault();
	submitBtn.innerText = "Just a moment...";
	isVerified();
	const inputFields = {
		name: username.value,
		subject: subject.value,
		email: email.value,
		message: message.value,
		"subscribe_consent": subscribeConsent,
	};
	emailjs.send(serviceID, templateID, inputFields)
	.then(() => {
		//Change button text
		submitBtn.innerText = "Message sent successfully";
		resetAfterWait(1500);
		//Clear out all input fields
		username.value = "";
		setResetFor(username);
		subject.value = "";
		setResetFor(subject);
		email.value = "";
		setResetFor(email);
		message.value = "";
		setResetFor(message);;
		subscribe.checked = false;
	}, (error) => {
		//Console log the error
		console.log(error);
		//Change button text
		submitBtn.innerText = "Something went wrong";
		setTimeout((submitBtn.innerText = "Submit") ,1500);
	})
	submitBtn.disabled = true;
});

// Getall input field values
// const inputFields = {
// 	name: nameInput.value,
// 	email: emailInput.value,
// 	message: messageInput.value
// }

/*Send the email
(Add service, template ID and input field values)*/


function checkUsername(e) {
	const value = e.target.value
	// const usernameValue = username.value.trim();
	if(!value) {
		setErrorFor(username, 'Name cannot be blank');
		userSuccess = false;
		
	} else {
		setSuccessFor(username)
		userSuccess = true;
	}
}
function checkEmail(e) {
	const value = e.target.value
	// const emailValue = email.value.trim();
	if(!value) {
		setErrorFor(email, 'Email cannot be blank');
		emailSuccess = false;
	} else if (!isEmail(value)) {
		setErrorFor(email, 'Not a valid email');
		emailSuccess = false;
	} else {
		setSuccessFor(email);
		emailSuccess = true;
	}
}
function checkSubject(e) {
	const value = e.target.value
	if(!value) {
		setErrorFor(subject, 'Subject cannot be blank');
		subjectSuccess = false;
	} else {
		setSuccessFor(subject);
		subjectSuccess = true;
	}
}
function checkMessage(e) {
	const value = e.target.value
	if(!value) {
		setErrorFor(message, 'Message cannot be blank');
		messageSuccess = false;
	} else {
		setSuccessFor(message);
		messageSuccess = true;
	}
}
// function checkInputs() {
// 	// trim to remove the whitespaces
// 	const usernameValue = username.value.trim();
// 	const emailValue = email.value.trim();
// 	const subjectValue = subject.value;
// 	const messageValue = message.value;

	
// 	if(usernameValue === '') {
// 		setErrorFor(username, 'Name cannot be blank');
// 	} else {
// 		setSuccessFor(username);

// 	}
	
// 	if(emailValue === '') {
//         setErrorFor(email, 'Email cannot be blank');
// 	} else if (!isEmail(emailValue)) {
//         setErrorFor(email, 'Not a valid email');
// 	} else {
//         setSuccessFor(email);
// 	}
    
// 	if(subjectValue === '') {
// 			setErrorFor(subject, 'Subject cannot be blank');
// 	} else {
// 			setSuccessFor(subject);
// 	}
	
// 	if(messageValue === '') {
// 		setErrorFor(message, 'Message cannot be blank');
// 	} else {
// 		setSuccessFor(message);
// 	}
// }

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

function setResetFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control';
}
	
function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function resetAfterWait(delay = 1500) {
	setTimeout(() => {
		submitBtn.innerText = "Submit"}, delay);
}