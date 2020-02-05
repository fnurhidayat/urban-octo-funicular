const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  should,
  expect
} = chai;

chai.use(chaiHttp);
const server = require('../index.js');

const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

const fixtures = require('./fixtures/userFixtures');
const staticSample = fixtures.create();

describe('User API', function() {

  before(function() {
    let encryptedPassword = bcrypt.hashSync(staticSample.password, 10);
    User.create({
      ...staticSample,
      password: encryptedPassword
    })
  })

  after(function() {
    User.deleteMany({})
  })

  context('POST /api/v1/users/register', function() {
      it('Should create new user', function() {
        chai.request(server)
          .post('/api/v1/users/register')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(fixtures.create()))
          .end(function(err, res) {
            expect(res.status).to.eq(201);

            let { status, data } = res.body;
            expect(status).to.eq(true);
            expect(data).to.be.an('object');
            expect(data).to.have.property('_id')
            expect(data).to.have.property('email')
            expect(data.email).to.eq(data.email)
          })
      })

      it('Should not create a new user', function() {
        let data = fixtures.create();
        delete data.name;
        
        chai.request(server)
          .post('/api/v1/users/register')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(data))
          .end(function(err, res) {
            expect(res.status).to.eq(422);

            let { status, errors } = res.body;
            expect(status).to.eq(false);
            expect(errors).to.be.an('object');
            expect(errors.message).to.eq('User validation failed: name: Path `name` is required.');
          })
      })

      it('Should not create a new user due to duplication', function() {
          chai.request(server)
            .post('/api/v1/users/register')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(staticSample))
            .end(function(err, res) {
              expect(res.status).to.eq(422);

              let { status, errors } = res.body;
              expect(status).to.eq(false);
              expect(errors).to.be.an('object');
            }) 
      })
  })

  context('POST /api/v1/users/login', function() {
    it('Should successfully logged in', function() {
        chai.request(server)
        .post('/api/v1/users/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(staticSample))
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body.status).to.eq(true);
          expect(res.body.data).to.be.a('string');
        })
    })
  })
})
