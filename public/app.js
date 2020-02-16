//token and user projects
let token = '';
let projects = {};

// function to clear form fields
function clearRegister() {
    document.querySelector('.signup-form').reset();
}
function clearLogin() {
    document.querySelector('.signin-form').reset();
}
function clearMedForm() {
    document.querySelector('.med-form').reset();
}
function switchToDashboard() {
    document.querySelector('.signin').classList.add('hide');
    document.querySelector('.container-dashboard').classList.remove('hide');
    document.querySelector('.loading').classList.add('hide');
}
function setUpDashboard(userInfo) {
    document.querySelector('#welcome-user').innerHTML = `Welcome ${userInfo.name}`;
    document.querySelector('.dashboard-cards').innerHTML = '';
}

// DASHBOARD ENTRY DISPLAY
function displayEntries(projectsObj) {
    setUpDashboard(projectsObj.user);
    const items = projectsObj.projects.map(project => {
        return `
        <div class="card" id='${project._id}'>
                    <div class="card-data-container">
                        <div class="card-data" id='${project._id}'>
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
                    </div>
                    <div class="card-form-container hide">
                        <div class="card-form">
                            <form>
                                <input type="text" id="medicine" placeholder="Medicine name" class="inputs-text ph" required>
                                <input type="text" id="amount" placeholder="How much to take" class="inputs-text ph" required>
                                <input type="text" id="prescriber" placeholder="Who prescribed it" class="inputs-text ph" required>
                                <input type="text" id="pharmacy" placeholder="Pharmacy" class="inputs-text ph" required>
                                <input type="text" id="start" placeholder="Start date" class="inputs-text ph" required>
                                <button class="button-filled-negative">ADD</button>
                            </form>
                        </div>
                    </div>        
                    
        </div> 
        `
    }).join('');
   document.querySelector('.dashboard-cards').innerHTML += items;
   switchToDashboard();
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
    console.log(newUser);
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
        getEntries(token);
    }
});


function getMedInfo() {
    const medicine = document.querySelector('#medicine').value;
    const amount = document.querySelector('#amount').value;
    const prescriber = document.querySelector('#prescriber').value;
    const pharmacy = document.querySelector('#pharmacy').value;
    const start = document.querySelector('#start').value;

    const data = {
        medicine: medicine,
        amount: amount,
        prescriber: prescriber,
        pharmacy: pharmacy,
        start: start
    }
    return (JSON.stringify(data));
}

// LOGOUT
const logoutButton = document.querySelector('#logout-button');
logoutButton.addEventListener('click', function() {
    document.querySelector('.container-dashboard').classList.add('hide');
    document.querySelector('.container-landing').classList.remove('hide');

    token = '';
    projects = {};
    document.querySelector('.dashboard-cards').innerHTML = '';
});

// ADDING ENTRY
const addEntry = document.querySelector('#add-button');
addEntry.addEventListener('click', function() {
    document.querySelector('.dashboard-form-container').classList.remove('hide');
});

const addMed = document.querySelector('#add-medicine-button');
addMed.addEventListener('click', async function(e) {
    e.preventDefault();

    const data = getMedInfo();
    console.log(data);
    const response = await fetch('api/meds/post', {
        method: 'POST',
        mode: "cors",
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: data
    });
    const newPost = await response.json();
    document.querySelector('.dashboard-form-container').classList.add('hide');
    console.log(newPost);
    clearMedForm();
    getEntries(token);
});