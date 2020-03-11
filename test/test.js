const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer }= require('../server');
const user = require('../models/userModel');

const expect = chai.expect;
chai.use(chaiHttp);


// describe('TESTING APPLICATION', function() {
//     let testUser = '';
//     const name = 'username';
//     const email = 'useremail@email.com';
//     const password = 'pass1234';
//     const name2 = 'username2';
//     const email2 = 'useremail2@email.com';
//     const password2 = '1234pass';

//     before(function() {
//         return runServer();
//     });

//     beforeEach(async function() {
//         testUser = new user({
//             name: name,
//             email: email,
//             password: password
//         });
//         return await testUser.save();
//     });

//     afterEach(async function() {
//         return await testUser.remove();
//     });
    
//     after(function() {
//         return closeServer();
//     });

//     describe('USER ROUTES', function() {
//         it('/', function() {
//             return chai.request(app)
//             .get('/')
//             .then(function(res) {
//                 expect(res).to.have.status(200);
//                 expect(res).to.be.html;
//             })
//         });
//         it('/api/user/register', function() {
//             this.timeout(15000);
            
//             return chai.request(app)
//             .post('api/user/register')
//             .send({
//                 name: name2,
//                 email: email2,
//                 password: password2
//             })
//             .then(res => {res.json()})
//             .then(data => {
//                 console.log(data);
//             })
//         })
//     });
// });