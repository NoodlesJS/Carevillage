const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Status code', function() {
    it('Should give status 200 when GET runs', function() {
        return chai.request(app)
        .get('/')
        .then(function(res) {
            expect(res).to.have.status(200);
        })
    })
})