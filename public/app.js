//token and user projects
let token = '';
let projects = [];

// function to clear form fields
function clearRegister() {
    document.querySelector('.signup-form').reset();
}
function clearLogin() {
    document.querySelector('.signin-form').reset();
}
function switchToDashboard() {
    document.querySelector('.signin').classList.add('hide');
    document.querySelector('.container-dashboard').classList.remove('hide');
    document.querySelector('.loading').classList.add('hide');
}

// DASHBOARD ENTRY DISPLAY
function displayEntries(projects) {
    const items = projects.map(project => {
        return `
        <div class="card" id='${project._id}'>
            <div class="medicine">
                <p class="small-title" style="color: white;">Medicine Name</p>
                <p class="small-text" style="color: white;">${project.medicine}</p>
            </div>
            <div class="amount">
                <p class="small-title" style="color: white;">How much to take</p>
                <p class="small-text" style="color: white;">${project.amount}</p>
            </div>
            <div class="prescriber">
                <p class="small-title" style="color: white;">Who prescribed it</p>
                <p class="small-text" style="color: white;">${project.prescriber}</p>
            </div>
            <div class="pharmacy">
                <p class="small-title" style="color: white;">Pharmacy</p>
                <p class="small-text" style="color: white;">${project.pharmacy}</p>
            </div>
            <div class="start">
                <p class="small-title" style="color: white;">Start Date</p>
                <p class="small-text" style="color: white;">${project.start}</p>
            </div>
            <div class="dashboard-cards-button">
                <button class="button-filled-negative">EDIT</button>
                <button class="button-filled-negative">DELETE</button>
            </div>
        </div>
        `
    }).join('');
   document.querySelector('.dashboard-cards').innerHTML += items;
   switchToDashboard();
}

function addEntries() {
    projects.forEach(function(project) {
        let data = `
                <div class="card" id='${project._id}'>
                    <div class="medicine">
                        <p class="small-title" style="color: white;">Medicine Name</p>
                        <p class="small-text" style="color: white;">${project.medicine}</p>
                    </div>
                    <div class="amount">
                        <p class="small-title" style="color: white;">How much to take</p>
                        <p class="small-text" style="color: white;">${project.amount}</p>
                    </div>
                    <div class="prescriber">
                        <p class="small-title" style="color: white;">Who prescribed it</p>
                        <p class="small-text" style="color: white;">${project.prescriber}</p>
                    </div>
                    <div class="pharmacy">
                        <p class="small-title" style="color: white;">Pharmacy</p>
                        <p class="small-text" style="color: white;">${project.pharmacy}</p>
                    </div>
                    <div class="start">
                        <p class="small-title" style="color: white;">Start Date</p>
                        <p class="small-text" style="color: white;">${project.start}</p>
                    </div>
                    <div class="dashboard-cards-button">
                        <button class="button-filled-negative">EDIT</button>
                        <button class="button-filled-negative">DELETE</button>
                    </div>
                </div>
        `
        displayEntries(data);
    })
}



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
    projects = entries;
    console.log(projects); //clear this out later
    displayEntries(projects);
    // addEntries();
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





// LOGIN
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
    
    try {
        token = await response.json();
        console.log(token);
    }catch(err) {
        console.log(err);
    }
    
    // checking if fetched value is incorrect
    if (token === 'Incorrect credentials') {
        document.querySelector('.loading').classList.add('hide');
        alert('Incorrect credentials. Please try again');
    }
    else {
        clearLogin();
        getEntries(token.token);
    }
});