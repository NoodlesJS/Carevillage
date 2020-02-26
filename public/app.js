//token and user projects
let auth = {};
let projects = {};

// ALL FUNCTIONS
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
    document.querySelector('.signup').classList.add('hide');
    document.querySelector('.container-dashboard').classList.remove('hide');
    document.querySelector('.loading').classList.add('hide');
}
function setUpDashboard(userInfo) {
    document.querySelector('#welcome-user').innerHTML = `Welcome, ${userInfo.name}`;
    document.querySelector('.dashboard-cards').innerHTML = '';
}
function showEdit(target) {
    target.parentElement.parentElement.parentElement.classList.add('hide');
    target.parentElement.parentElement.parentElement.parentElement.lastElementChild.classList.remove('hide');
}
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
function getRegisterLogin() {
    const email = document.querySelector('#register-email').value;
    const password = document.querySelector('#register-password').value;

    const data = {
        email: email,
        password: password
    }
    return (JSON.stringify(data));
}

function getLogin() {
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    const data = {
        email: email,
        password: password
    }
    return (JSON.stringify(data));
}

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
function getEditForm(target) {
    const medicine = target.form[0].value
    const amount = target.form[1].value
    const prescriber = target.form[2].value
    const pharmacy = target.form[3].value
    const start = target.form[4].value

    const data = {
        medicine: medicine,
        amount: amount,
        prescriber: prescriber,
        pharmacy: pharmacy,
        start: start
    }
    return (JSON.stringify(data));
}
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
    projects.projects.reverse();
    displayEntries(projects);
    // addEntries();
}

// DASHBOARD ENTRY DISPLAY
function displayEntries(projectsObj) {
    setUpDashboard(projectsObj.user);
    const items = projectsObj.projects.map(project => {
        return `
        <div class="card">
                    <div class="card-data-container">
                        <div class="card-data">
                            <div class="medicine">
                                <p class="small-title" style="color: #B56983;">Medicine Name</p>
                                <p class="small-text" style="color: #B56983;">${project.medicine}</p>
                            </div>
                            <div class="amount">
                                <p class="small-title" style="color: #B56983;">How much to take</p>
                                <p class="small-text" style="color: #B56983;">${project.amount}</p>
                            </div>
                            <div class="prescriber">
                                <p class="small-title" style="color: #B56983;">Who prescribed it</p>
                                <p class="small-text" style="color: #B56983;">${project.prescriber}</p>
                            </div>
                            <div class="pharmacy">
                                <p class="small-title" style="color: #B56983;">Pharmacy</p>
                                <p class="small-text" style="color: #B56983;">${project.pharmacy}</p>
                            </div>
                            <div class="start">
                                <p class="small-title" style="color: #B56983;">Start Date</p>
                                <p class="small-text" style="color: #B56983;">${project.start}</p>
                            </div>
                            <div class="button-container">
                                <button class="button-filled edit-button">EDIT</button>
                                <button class="button-filled delete-button" id='${project._id}'>DELETE</button>
                            </div>
                        </div>
                    </div>
                    <div class="card-form-container hide">
                        <div class="card-form">
                            <form>
                                <input type="text" id="medicine" placeholder="Medicine name" class="inputs-text ph" value="${project.medicine}" required>
                                <input type="text" id="amount" placeholder="How much to take" class="inputs-text ph" value="${project.amount}" required>
                                <input type="text" id="prescriber" placeholder="Who prescribed it" class="inputs-text ph" value="${project.prescriber}" required>
                                <input type="text" id="pharmacy" placeholder="Pharmacy" class="inputs-text ph" value="${project.pharmacy}" required>
                                <input type="text" id="start" placeholder="Start date" class="inputs-text ph" value="${project.start}" required>
                                <button class="button-filled update-entry-button" id='${project._id}'>ADD</button>
                            </form>
                        </div>
                    </div>        
                    
        </div>
        `
    }).join('');
   document.querySelector('.dashboard-cards').innerHTML += items;
   switchToDashboard();
}
async function addEntry(data) {
    const response = await fetch('api/meds/post', {
        method: 'POST',
        mode: "cors",
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': auth.token
        },
        body: data
    });
    const newPost = await response.json();
    document.querySelector('.dashboard-form-container').classList.add('hide');
    clearMedForm();
    getEntries(auth.token);
}

async function deleteEntry(id) {
    const response = await fetch(`api/meds/${id}`, {
        method: 'DELETE',
        mode: "cors",
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': auth.token
        }
    });
    const message = await response.json();
    getEntries(auth.token);
    
}


async function signUp() {
    document.querySelector('#invalid-signup').classList.add('hide');
    const data = getRegister();
    document.querySelector('.loading').classList.remove('hide');
    const response = await fetch('/api/user/register', {
        method: 'POST',
        mode: "cors",
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
    })

    
    const newUser = await response.json();
    try {
        if('Error' in newUser) {
            document.querySelector('.loading').classList.add('hide');
            document.querySelector('#invalid-signup').classList.remove('hide');
            document.querySelector('#invalid-signup').innerHTML = `${newUser.Error}`;
            
        }
        else {
            signInFromRegister();
        }
    } catch (error) {
        console.log(error);
    }
}

async function signIn() {
    document.querySelector('#invalid-signin').classList.add('hide');
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
        auth = await response.json();
        if('Error' in auth) {
            document.querySelector('.loading').classList.add('hide');
            document.querySelector('#invalid-signin').classList.remove('hide');
            document.querySelector('#invalid-signin').innerHTML = `${auth.Error}`;
            
        }
        else {
            clearLogin();
            getEntries(auth.token);
        }
    }catch(err) {
        console.log(err);
    }
    
    
}

async function signInFromRegister() {
    const data = getRegisterLogin();
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
        auth = await response.json();
    }catch(err) {
        console.log(err);
    }
    
    clearRegister();
    clearLogin();
    getEntries(auth.token);
    
}
async function updateInfo(target, id) {
    const data = getEditForm(target);
    await fetch(`api/meds/${id}`, {
        method: 'PUT',
        mode: "cors",
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': auth.token
        },
        body: data
    });
    try {
        getEntries(auth.token);
    } catch (error) {
        console.log(error);
    }
}



// SIGN UP BUTTON PRESSED
const signUpButton = document.querySelector('#signup-button');
signUpButton.addEventListener('click', async function(e) {
    e.preventDefault();
    signUp(); 
});



// SIGN IN BUTTON PRESSED
const signInBUtton = document.querySelector('#signin-button');
signInBUtton.addEventListener('click', async function(e) {
    e.preventDefault();
    signIn();
});


// ADDING ENTRY
const addEntryButton = document.querySelector('#add-button');
addEntryButton.addEventListener('click', function() {
    document.querySelector('.med-form').reset();
    document.querySelector('.dashboard-form-container').classList.toggle('hide');
});
const addMed = document.querySelector('#add-medicine-button');
addMed.addEventListener('click', async function(e) {
    e.preventDefault();
    const data = getMedInfo();
    addEntry(data);
});

// DELETE or EDIT key pressed
const cardButtons = document.querySelector('.dashboard-cards');
cardButtons.addEventListener('click', function(e) {
    let target = e.target;
    if(target.matches('.delete-button')) {
        deleteEntry(target.id);
    }
    else if(target.matches('.edit-button')) {
        showEdit(target);
    }
    else {
        
    }
});

// UPDATE/ADD button pressed on edit form
cardButtons.addEventListener('click', function(e) {
    e.preventDefault();
    let target = e.target;
    if(target.matches('.update-entry-button')) {
        updateInfo(target, target.id);
    }
});

// LOGOUT
const logoutButton = document.querySelector('#logout-button');
logoutButton.addEventListener('click', function() {
    document.querySelector('.container-dashboard').classList.add('hide');
    document.querySelector('.container-landing').classList.remove('hide');

    auth = {};
    projects = {};
    document.querySelector('.dashboard-cards').innerHTML = '';
});



