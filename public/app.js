let token = '';
const userEntry = [];
// GET USER ENTRIES
 async function getEntries(key) {
    const userData = await fetch('/api/meds/', {
        method: 'GET',
        mode: "cors",
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': key
        }
    });
    
   const entries = await userData.json();
   console.log(entries);
   document.querySelector('.signin').classList.add('hide');
   document.querySelector('.container-dashboard').classList.remove('hide');
   document.querySelector('.loading').classList.add('hide');

}

// REGISTRATION

// function to get sign up form data
function getRegister() {
    const name = document.querySelector('#register-name').value;
    const email = document.querySelector('#register-email').value;
    const password = document.querySelector('#register-password').value;

    const data = {
        name: name,
        email: email,
        password: password
    }
    return (JSON.stringify(data));
}

// function to clear form fields
function clearRegister() {
    document.querySelector('.signup-form').reset();
}
function clearLogin() {
    document.querySelector('.signin-form').reset();
}

// sign up button pressed
const signUpButton = document.querySelector('#signup-button');
signUpButton.addEventListener('click', async function(e) {
    e.preventDefault();

    const data = getRegister();
    document.querySelector('.loading').classList.remove('hide');
    const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
    })

    
    const newUser = await response.json();
    document.querySelector('.loading').classList.add('hide');
    clearRegister();
    alert('Account has been created. Please sign in to check on your medication');
});


// LOGIN AND GETTING USER ENTRY

// function to get login form data
function getLogin() {
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    const data = {
        email: email,
        password: password
    }
    return (JSON.stringify(data));
}
function clearLogin() {
    document.querySelector('.signin-form').reset();
}

function checkCredentials() {
    if (token === 'Incorrect credentials') {
        document.querySelector('.loading').classList.add('hide');
        alert('Incorrect credentials. Please try again');
    }
    return;
}

// sign in button is pressed
const signInBUtton = document.querySelector('#signin-button');
signInBUtton.addEventListener('click', async function(e) {
    e.preventDefault();

    const data = getLogin();
    document.querySelector('.loading').classList.remove('hide');
    const response = await fetch('api/user/login', {
        method: 'POST',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        body: data
    });
    
   token = await response.json();
   console.log(token.token);
    if (token === 'Incorrect credentials') {
        document.querySelector('.loading').classList.add('hide');
        alert('Incorrect credentials. Please try again');
    }
    else {
        clearLogin();
        getEntries(token.token);
    }

    
});