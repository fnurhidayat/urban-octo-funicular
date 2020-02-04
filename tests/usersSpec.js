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

describe('User API', () => {

  before(done => {
    let encryptedPassword = bcrypt.hashSync(staticSample.password, 10);
    User.create({
      ...staticSample,
      password: encryptedPassword
    })
      .then(i => done())
      .catch(err => {
        console.log(err);
        done()
      })
    ;
  })

  after(done => {
    User.deleteMany({})
      .then(() => done());
      .catch(err => {
        console.log(err);
        done()
      })
  })

  context('POST /api/v1/users/register', () => {
      it('Should create new user', done => {
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

            done();
          })
      })

      it('Should not create a new user', done => {
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

            done();
          })
      })

      it('Should not create a new user due to duplication', done => {
          chai.request(server)
            .post('/api/v1/users/register')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(staticSample))
            .end(function(err, res) {
              expect(res.status).to.eq(422);

              let { status, errors } = res.body;
              expect(status).to.eq(false);
              expect(errors).to.be.an('object');

              done();
            }) 
      })
  })

  context('POST /api/v1/users/login', () => {
    it('Should successfully logged in', done => {
        chai.request(server)
        .post('/api/v1/users/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(staticSample))
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body.status).to.eq(true);
          expect(res.body.data).to.be.a('string');

          done();
        })
    })
  })
})
