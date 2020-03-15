const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const { app, runServer, closeServer }= require('../server');
const user = require('../models/userModel');

const expect = chai.expect;
chai.use(chaiHttp);



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
    


describe('Carevillage Application Test', function() {

    let testUser = ''
    let auth_token = ''
    const password = 'testpassword';

    before(async function() {
        runServer();

        this.timeout(15000);
        return testUser = await 
        chai.request(app).post('/api/user/register')
        .set('content-type', 'application/json')
        .send({
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: password
        });
    });
    after(async function() {
        await user.findOne({email: testUser.body.email}).deleteOne();
        closeServer();
    });

    describe('GET WEBSITE', function() {

        //FETCH WEBSITE
        it('Should fetch the website successfully', async function() {
            const data = await chai.request(app).get('/');

            try {
                expect(data).to.have.status(200);
                expect(data).to.be.html;
            } catch (error) {
                expect.fail(error)
            }
            
        });
    });

    describe('USER ROUTES - REGISTER', function() {

        //EMPTY EMAIL FIELD
        it('Should not complete with empty email field', async function() {
            this.timeout(15000);

            const data = await 
            chai.request(app).post('/api/user/register')
            .set('content-type', 'application/json')
            .send({
                name: faker.name.findName(),
                email: '',
                password: faker.internet.password()
            })

            try {
                expect(data).to.have.status(400);
                expect(data.body).to.be.an('object');
                expect(data.body).to.have.keys('Error')
                expect(data.body.Error).to.include(`"email" is not allowed to be empty`);
            } catch (error) {
                expect.fail(error)
            }
        });


        //EMPTY PASSWORD FIELD
        it('Should not complete with empty password field', async function() {
            this.timeout(15000);

            const data = await 
            chai.request(app).post('/api/user/register')
            .set('content-type', 'application/json')
            .send({
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: ''
            })

            try {
                expect(data).to.have.status(400);
                expect(data.body).to.be.an('object');
                expect(data.body).to.have.keys('Error')
                expect(data.body.Error).to.include(`"password" is not allowed to be empty`);
            } catch (error) {
                expect.fail(error)
            }
        });


        //PASSWORD LENGTH TOO SMALL
        it('Should not complete if password is too short', async function() {
            this.timeout(15000);

            const data = await 
            chai.request(app).post('/api/user/register')
            .set('content-type', 'application/json')
            .send({
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: '1234'
            })

            try {
                expect(data).to.have.status(400);
                expect(data.body).to.be.an('object');
                expect(data.body).to.have.keys('Error')
                expect(data.body.Error).to.include(`"password" length must be at least 6 characters long`);
            } catch (error) {
                expect.fail(error)
            }
        });


        //EMAIL ALREADY EXISTS
        it('Should not complete if email already exists', async function() {
            this.timeout(15000);

            const data = await 
            chai.request(app).post('/api/user/register')
            .set('content-type', 'application/json')
            .send({
                name: faker.name.findName(),
                email: 'john@email.com',
                password: faker.internet.password()
            })

            try {
                expect(data).to.have.status(400);
                expect(data.body).to.be.an('object');
                expect(data.body).to.have.keys('Error')
                expect(data.body.Error).to.include(`john@email.com already exists`);
            } catch (error) {
                expect.fail(error)
            }
        });
        

        //REGISTER CAREVILLAGE USER
        it('Should create a new carevillage user', async function() {
            this.timeout(15000);

            const data = await 
            chai.request(app).post('/api/user/register')
            .set('content-type', 'application/json')
            .send({
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            })

            try {
                expect(data).to.have.status(201);
                expect(data.body).to.be.an('object');
                expect(data.body).to.have.keys('name', 'email');
            } catch (error) {
                expect.fail(error)
            }

            await user.findOne({email: data.body.email}).deleteOne();
        });
    });

    describe('USER ROUTES - LOGIN', function() {

        //BLANK EMAIL FIELD
        it('Should not complete if email field is blank', async function() {
            this.timeout(15000);

            const data = await
            chai.request(app).post('/api/user/login')
            .set('content-type', 'application/json')
            .send({
                email: '',
                password: password
            })

            try {
                expect(data).to.have.status(400);
                expect(data.body).to.be.an('object');
                expect(data.body).to.have.keys('Error')
                expect(data.body.Error).to.include(`"email" is not allowed to be empty`);
            } catch (error) {
                expect.fail(error)
            }
        });


        //BLANK PASSWORD FIELD
        it('Should not complete if password field is blank', async function() {
            this.timeout(15000);

            const data = await
            chai.request(app).post('/api/user/login')
            .set('content-type', 'application/json')
            .send({
                email: testUser.body.email,
                password: ''
            })

            try {
                expect(data).to.have.status(400);
                expect(data.body).to.be.an('object');
                expect(data.body).to.have.keys('Error')
                expect(data.body.Error).to.include(`"password" is not allowed to be empty`);
            } catch (error) {
                expect.fail(error)
            }
        });


        //EMAIL DOES NOT EXIST
        it('Should not complete if email does not exist', async function() {
            this.timeout(15000);

            const data = await
            chai.request(app).post('/api/user/login')
            .set('content-type', 'application/json')
            .send({
                email: faker.internet.email(),
                password: password
            })

            try {
                expect(data).to.have.status(400);
                expect(data.body).to.be.an('object');
                expect(data.body).to.have.keys('Error')
                expect(data.body.Error).to.include(`Email doesn't exist`);
            } catch (error) {
                expect.fail(error)
            }
        });


        //PASSWORD DOES NOT MATCH
        it('Should not complete if password does not exist', async function() {
            this.timeout(15000);

            const data = await
            chai.request(app).post('/api/user/login')
            .set('content-type', 'application/json')
            .send({
                email: testUser.body.email,
                password: faker.internet.password()
            })

            try {
                expect(data).to.have.status(400);
                expect(data.body).to.be.an('object');
                expect(data.body).to.have.keys('Error')
                expect(data.body.Error).to.include(`Invalid password`);
            } catch (error) {
                expect.fail(error)
            }
        });


        //LOGIN USER
        it('Should login user', async function() {
            this.timeout(15000);

            const data = await
            chai.request(app).post('/api/user/login')
            .set('content-type', 'application/json')
            .send({
                email: testUser.body.email,
                password: password
            })

            try {
                expect(data).to.have.status(200);
                expect(data.body).to.be.an('object');
                expect(data.body).to.have.keys('token');
                auth_token = data.body.token;
            } catch (error) {
                expect.fail(error)
            }
        });
    });
});