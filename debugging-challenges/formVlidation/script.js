let summarySection=document.getElementById('summarySection')
let nameInput=document.getElementById('nameInput')
let emailInput=document.getElementById("emailInput")
let passwordInput=document.getElementById('passwordInput')
let confirmPasswordInput=document.getElementById('confirmPasswordInput')
let registerForm=document.getElementById("registerForm")

function validateName(){
    let nameValue=nameInput.value
    if(nameValue==''){
        nameInput.nextElementSibling.innerHTML="Please enter the name"
        return false

    } else{
        nameInput.nextElementSibling.innerHTML=""
        return true
    }
}

function validateEmail(){
    let emailValue=emailInput.value
    if(emailValue==""){

      emailInput.nextElementSibling.innerHTML="Please enter the email"
        return false
    }else if(!emailValue.includes('@')){
        emailInput.nextElementSibling.innerHTML="The Email field must contain an “@” symbol."
        return false
    }else{
        emailInput.nextElementSibling.innerHTML=""
        return true
    }
}

function validatePassword() {
    let value = passwordInput.value.trim();
    let error = passwordInput.nextElementSibling;

    if (value === "") {
        passwordInput.nextElementSibling.innerText = "Please enter the password";
        return false;
    } else {
        passwordInput.nextElementSibling.innerText = "";
        return true;
    }
}

function validateConfirmPassword() {
    let value = confirmPasswordInput.value;

    if (value === "") {
        confirmPasswordInput.nextElementSibling.innerText = "Please confirm the password";
        return false;
    }
    else if (value !== passwordInput.value) {
        confirmPasswordInput.nextElementSibling.innerText = "Password and Confirm Password must match";
        return false;
    }
    else {
        confirmPasswordInput.nextElementSibling.innerText = "";
        return true;
    }
}

nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);
confirmPasswordInput.addEventListener("blur", validateConfirmPassword);


registerForm.addEventListener('submit',(event)=>{
    event.preventDefault()
    if( validateName()&&validateEmail()&&validatePassword()&&validateConfirmPassword()){
        summarySection.innerHTML=`
        Name:${nameInput.value}<br>
        Email:${emailInput.value}<br>
        Password:${passwordInput.value}<br>
        Confirm Password:${confirmPasswordInput.value}
        `
    }
})


