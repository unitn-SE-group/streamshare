import request from 'supertest'
import app from '../app/app.js'

describe('POST /auth/login', () => {
  /**
   * Send a POST request to the API login endpoint with an object email and password
   * needed for the login
   * This one provides the API the correct password and email
   */
  it('should respond with a 201 status and an object containing access and refresh tokens for existing user', async () => {
    // insert user in database
    await request(app).post('/auth/register').send({
      createdWith: 'local',
      userType: 'admin',
      email: 'daniele.pedrolli@studenti.unitn.it',
      FirstName: 'daniele',
      LastName: 'pedrolli',
      username: 'pedwoo',
      gender: 'true',
      password: 'ciaociao',
      birthDay: '07/08/2003'
    })

    const loginData = {
      email: 'daniele.pedrolli@studenti.unitn.it',
      password: 'ciaociao'
    }

    const res = await request(app).post('/auth/login').send(loginData)

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
    expect(res.body).toHaveProperty('user_type')
  })

  //This one provides the API the incorrect password.

  it('should respond with a 401 status for wrong password', async () => {
    const wrongLoginData = {
      email: 'daniele.pedrolli@studenti.unitn.it',
      password: 'notciaociao'
    }
    const res = await request(app).post('/auth/login').send(wrongLoginData)
    expect(res.status).toBe(401)
  })

  //This one provides the API the incorrect amount of informations.

  it('should respond with a 400 status for not providing all informations necessary', async () => {
    const missingLoginData = {
      email: 'daniele.pedrolli@studenti.unitn.it'
    }
    const res = await request(app).post('/auth/login').send(missingLoginData)
    expect(res.status).toBe(400)
  })

  //This one provides the API an email not present in the database.

  it('should respond with a 404 status due to non-existent account', async () => {
    const nonExistentEmailData = {
      email: 'notdaniele.pedrolli@studenti.unitn.it',
      password: 'ciaociao'
    }
    const res = await request(app).post('/auth/login').send(nonExistentEmailData)
    expect(res.status).toBe(404)
  })
})

describe('DELETE /auth/logout', () => {
  it('should respond with a 204 status for successful logout', async () => {
    // insert user in database
    await request(app).post('/auth/register').send({
      createdWith: 'local',
      userType: 'admin',
      email: 'daniele.pedrolli@studenti.unitn.it',
      FirstName: 'daniele',
      LastName: 'pedrolli',
      username: 'pedwoo',
      gender: 'true',
      password: 'ciaociao',
      birthDay: '07/08/2003'
    })
    // login user
    const loginData = {
      email: 'daniele.pedrolli@studenti.unitn.it',
      password: 'ciaociao'
    }
    // store accessToken
    const login_data = await request(app).post('/auth/login').send(loginData)
    const accessToken = login_data.body.accessToken
    //console.log(accessToken)
    // send request to logout with cookie
    const res = await request(app)
      .delete('/auth/logout')
      .set('Cookie', [`accessToken=${accessToken}`])

    expect(res.status).toBe(204)
  })
})

/**
 * This one tests the authentication procedure for an admin-only endpoint
 */
describe('GET /test1', () => {
  it('should respond with a 403 status for unauthorized user', async () => {
    // create user
    const register_data = await request(app).post('/auth/register').send({
      createdWith: 'local',
      userType: 'consumer',
      email: 'mario.rossi@gmail.com',
      FirstName: 'mario',
      LastName: 'rossi',
      username: 'marietto',
      gender: 'true',
      password: 'password123',
      birthDay: '1919-07-28'
    })
    //console.log(JSON.stringify(register_data.body))
    // login user
    const loginData = {
      email: 'mario.rossi@gmail.com',
      password: 'password123'
    }
    const login_data = await request(app).post('/auth/login').send(loginData)
    //console.log(JSON.stringify(login_data.body))
    // store accessToken
    const accessToken = login_data.body.accessToken
    // send request to logout with cookie
    const res = await request(app)
      .get('/test1')
      .set('Cookie', [`accessToken=${accessToken}`])
    expect(res.status).toBe(403)
  })

  it('should respond with a 200 status for an authorized user', async () => {
    // insert user in database
    await request(app).post('/auth/register').send({
      createdWith: 'local',
      userType: 'admin',
      email: 'daniele.pedrolli@studenti.unitn.it',
      FirstName: 'daniele',
      LastName: 'pedrolli',
      username: 'pedwoo',
      gender: 'true',
      password: 'ciaociao',
      birthDay: '07/08/2003'
    })
    // login user
    const loginData = {
      email: 'daniele.pedrolli@studenti.unitn.it',
      password: 'ciaociao'
    }
    const login_data = await request(app).post('/auth/login').send(loginData)
    // store accessToken
    const accessToken = login_data.body.accessToken
    //console.log('accessToken',accessToken)
    // send request to logout with cookie
    const res = await request(app)
      .get('/test1')
      .set('Cookie', [`accessToken=${accessToken}`])
    expect(res.status).toBe(200)
  })
})
/**
 * This one tests the authentication procedure for an endpoint accessible by anyone
 */
describe('GET /test2', () => {
  it('should respond with a 200 status for anyone who has logged in', async () => {
    // create user
    await request(app).post('/auth/register').send({
      createdWith: 'local',
      userType: 'consumer',
      email: 'mario.rossi@gmail.com',
      FirstName: 'mario',
      LastName: 'rossi',
      username: 'marietto',
      gender: 'true',
      password: 'password123',
      birthDay: '1919-07-28'
    })
    // login user
    const loginData = {
      email: 'mario.rossi@gmail.com',
      password: 'password123'
    }
    const login_data = await request(app).post('/auth/login').send(loginData)
    // store accessToken
    const accessToken = login_data.body.accessToken
    // send request to logout with cookie
    const res = await request(app)
      .get('/test2')
      .set('Cookie', [`accessToken=${accessToken}`])
    expect(res.status).toBe(200)
  })
})
