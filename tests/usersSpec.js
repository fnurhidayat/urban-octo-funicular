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

const user = {
  name: 'Fikri',
  email: 'test01@mail.com',
  password: '123456' 
}

describe('User API', () => {

  before(done => {
    User.create({
      ...user,
      password: bcrypt.hashSync(user.password)
    }).then(i => done());
  })

  after(done => {
    User.deleteMany({})
      .then(() => done());
  })

  context('POST /api/v1/users/register', () => {
      it('Should create new user', done => {
        let data = {
          ...user,
          email: 'test02@mail.com'
        }

        console.log(data);

        chai.request(server)
          .post('/api/v1/users/register')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(data))
          .end(function(err, res) {
            console.log(res.body);
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
        let data = {
          email: 'test01@mail.com',
          password: '123456' 
        }
        
        chai.request(server)
          .post('/api/v1/users/register')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(data))
          .end(function(err, res) {
            console.log(res.body);
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
            .send(JSON.stringify(user))
            .end(function(err, res) {
              console.log(res.body);
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
        .send(JSON.stringify(user))
        .end(function(err, res) {
          console.log(res.body);``
          done();
        })
    })
  })
})
