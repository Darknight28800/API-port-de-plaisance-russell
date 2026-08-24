const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const bcrypt = require('bcrypt')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongod, app, mongoose, User, adminCookie, staffCookie

before(async () => {
    mongod = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } })
    process.env.MONGO_URI = mongod.getUri('port_russell_test')
    process.env.JWT_SECRET = 'test-secret'

    const connectDB = require('../config/db')
    mongoose = require('mongoose')
    app = require('../app')
    User = require('../models/User')

    await connectDB()

    await User.create({
        username: 'admin',
        email: 'admin@mail.com',
        password: await bcrypt.hash('123456', 10),
        role: 'admin'
    })
    await User.create({
        username: 'staff',
        email: 'staff@mail.com',
        password: await bcrypt.hash('123456', 10),
        role: 'user'
    })
})

after(async () => {
    await mongoose.disconnect()
    await mongod.stop()
})

test('GET / renders the home page', async () => {
    const res = await request(app).get('/')
    assert.equal(res.status, 200)
})

test('POST /login rejects a wrong password', async () => {
    const res = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin@mail.com', password: 'wrong' })

    assert.equal(res.status, 401)
})

test('POST /login succeeds and sets a session cookie', async () => {
    const res = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin@mail.com', password: '123456' })

    assert.equal(res.status, 200)
    assert.ok(res.headers['set-cookie'], 'expected a Set-Cookie header')
    adminCookie = res.headers['set-cookie']

    const staffRes = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ email: 'staff@mail.com', password: '123456' })
    staffCookie = staffRes.headers['set-cookie']
})

test('the API rejects unauthenticated requests', async () => {
    const res = await request(app).get('/catways')
    assert.equal(res.status, 401)
})

test('/dashboard redirects to home when not authenticated', async () => {
    const res = await request(app).get('/dashboard')
    assert.equal(res.status, 302)
})

test('catway CRUD flow with server-side validation', async () => {
    let res = await request(app)
        .post('/catways')
        .set('Cookie', adminCookie)
        .send({ catwayNumber: 1, catwayType: 'short', catwayState: 'bon état' })
    assert.equal(res.status, 201)

    res = await request(app)
        .post('/catways')
        .set('Cookie', adminCookie)
        .send({ catwayNumber: 1, catwayType: 'short', catwayState: 'doublon' })
    assert.equal(res.status, 400, 'duplicate catwayNumber must be rejected')

    res = await request(app).get('/catways').set('Cookie', adminCookie)
    assert.equal(res.status, 200)
    assert.equal(res.body.length, 1)

    res = await request(app)
        .put('/catways/1')
        .set('Cookie', adminCookie)
        .send({ catwayState: 'nouvel état' })
    assert.equal(res.status, 200)
    assert.equal(res.body.catwayState, 'nouvel état')
})

test('reservation CRUD flow with date and overlap validation', async () => {
    let res = await request(app)
        .post('/catways/1/reservations')
        .set('Cookie', adminCookie)
        .send({ catwayNumber: 1, clientName: 'Test', boatName: 'Boaty', startDate: '2025-06-10', endDate: '2025-06-01' })
    assert.equal(res.status, 400, 'endDate before startDate must be rejected')

    res = await request(app)
        .post('/catways/1/reservations')
        .set('Cookie', adminCookie)
        .send({ catwayNumber: 1, clientName: 'Test', boatName: 'Boaty', startDate: '2025-06-01', endDate: '2025-06-10' })
    assert.equal(res.status, 201)
    const reservationId = res.body._id

    res = await request(app)
        .post('/catways/1/reservations')
        .set('Cookie', adminCookie)
        .send({ catwayNumber: 1, clientName: 'Test2', boatName: 'Boaty2', startDate: '2025-06-05', endDate: '2025-06-08' })
    assert.equal(res.status, 400, 'overlapping reservation must be rejected')

    res = await request(app)
        .post('/catways/99/reservations')
        .set('Cookie', adminCookie)
        .send({ catwayNumber: 99, clientName: 'Test', boatName: 'Boaty', startDate: '2025-07-01', endDate: '2025-07-10' })
    assert.equal(res.status, 400, 'reservation on an unknown catway must be rejected')

    res = await request(app).get('/reservations').set('Cookie', adminCookie)
    assert.equal(res.status, 200)
    assert.equal(res.body.length, 1)

    res = await request(app)
        .delete(`/catways/1/reservations/${reservationId}`)
        .set('Cookie', adminCookie)
    assert.equal(res.status, 200)
})

test('user CRUD flow enforces unique email', async () => {
    let res = await request(app)
        .post('/users')
        .set('Cookie', adminCookie)
        .send({ username: 'bob', email: 'bob@mail.com', password: '123456' })
    assert.equal(res.status, 201)
    assert.equal(res.body.password, undefined, 'password must never be returned')

    res = await request(app)
        .post('/users')
        .set('Cookie', adminCookie)
        .send({ username: 'bob2', email: 'bob@mail.com', password: '123456' })
    assert.equal(res.status, 400, 'duplicate email must be rejected')

    res = await request(app)
        .delete('/users/bob@mail.com')
        .set('Cookie', adminCookie)
    assert.equal(res.status, 200)
})

test('a non-admin user cannot manage catways or users, but can manage reservations', async () => {
    let res = await request(app)
        .post('/catways')
        .set('Cookie', staffCookie)
        .send({ catwayNumber: 2, catwayType: 'short', catwayState: 'x' })
    assert.equal(res.status, 403)

    res = await request(app).get('/users').set('Cookie', staffCookie)
    assert.equal(res.status, 403)

    res = await request(app).get('/catways').set('Cookie', staffCookie)
    assert.equal(res.status, 200, 'read access stays open to any authenticated user')

    res = await request(app)
        .post('/catways/1/reservations')
        .set('Cookie', staffCookie)
        .send({ catwayNumber: 1, clientName: 'Staff', boatName: 'Boat', startDate: '2025-09-01', endDate: '2025-09-05' })
    assert.equal(res.status, 201, 'reservations stay open to any authenticated user')
})

test('dashboard pages render for an authenticated user', async () => {
    const pages = ['/dashboard', '/dashboard/catways', '/dashboard/reservations', '/dashboard/reservations/create']
    for (const page of pages) {
        const res = await request(app).get(page).set('Cookie', adminCookie)
        assert.equal(res.status, 200, `${page} should render`)
    }
})

test('GET /api-docs serves the Swagger documentation', async () => {
    const res = await request(app).get('/api-docs/')
    assert.equal(res.status, 200)
})

test('GET /logout clears the session and redirects home (browser navigation)', async () => {
    const res = await request(app).get('/logout').set('Cookie', adminCookie)
    assert.equal(res.status, 302)
    assert.equal(res.headers.location, '/')
})

test('GET /logout returns JSON when called as an API client', async () => {
    const res = await request(app)
        .get('/logout')
        .set('Cookie', adminCookie)
        .set('Accept', 'application/json')
    assert.equal(res.status, 200)
})
