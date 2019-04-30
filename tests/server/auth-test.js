// FROM https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/tests/server/auth-test.js

const request = require('supertest');
const app = require('../../src/server/app').app;
const Users = require('../../src/server/db/users');


const errorHandler = function(err, req, res, next){
    console.log(err.stack);
    res.send(500);
};
app.use(errorHandler);


beforeEach(() => {
    Users.initWithDemoUser();
});

test("Test failed login", async () =>{

    const response = await request(app)
        .post('/api/login')
        .send({userId: 'user', password: 'wrongpass'});

    expect(response.statusCode).toBe(401);
});


test("Test login", async () =>{

    const payload = {userId: 'john', password: 'password'};

    let response = await request(app)
        .get('/api/user');
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(payload.userId);
});


test("Test login with wrong password", async () =>{

    const userId = "john";
    const password = "password";
    const payload = {userId, password};


    let response = await request(app)
        .post('/api/login')
        .send({userId, password: "a wrong password"});
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
});


test("Test logout", async () =>{

    const payload = {userId: "john", password: "password"};

    let response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    //now we should be able to get it
    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);

    await  request(app)
        .post('/api/logout')
        .set('cookie', cookie)
        .send();

    //the cookie is no longer valid now after a logout
    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(401);
});


test("Test get token", async () =>{

    let response = await request(app)
        .post('/api/login')
        .send({userId: "john", password: "password"});
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    //can't get token without cookie
    response = await request(app)
        .post('/api/wstoken');
        //no cookie
    expect(response.statusCode).toBe(401);


    response = await request(app)
        .post('/api/wstoken')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(201);
    expect(response.body.wstoken).toBeDefined();
    const first = response.body.wstoken;

    response = await request(app)
        .post('/api/wstoken')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(201);
    expect(response.body.wstoken).toBeDefined();
    const second = response.body.wstoken;

    expect(first).not.toBe(second);
});

test("Test sign up", async () => {

    const response = await request(app)
        .post('/api/signup')
        .send({ userId: 'foo', password: '123' });

    expect(response.statusCode).toBe(201);
});

test("Test fail sign up twice", async () => {

    const payload = { userId: 'foo', password: '123' };

    let response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(201);

    response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(400);
});

test("Test logged in when signing up", async () => {

    const payload = { userId: 'foo', password: '123' };

    let response = await request(app)
        .get('/api/user');
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(201);
    const cookie = response.headers['set-cookie'];


    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(payload.userId);
});

test("Test sign up, and then login", async () => {

    const payload = { userId: 'foo', password: '123' };

    let response = await request(app)
        .get('/api/user');
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(201);


    response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(payload.userId);
});

test("Test update user", async () => {

    const payload = { userId: 'john', password: 'password' };
    let response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    const user = Users.get(payload.userId);
    user.name = "NewJohn";

    response = await request(app)
        .put('/api/user')
        .set('Cookie', cookie)
        .send(user)
    expect(response.statusCode).toBe(204);

    response = await request(app)
        .get('/api/user?userId=john')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(user.name);

})

test("Test post user", async () => {

    const payload = { userId: 'john', password: 'password' };
    let response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    const user = {userId: "john", friendId: "simen"};
    
    response = await request(app)
        .post('/api/user?accepted=true')
        .set('Cookie', cookie)
        .send(user)
    expect(response.statusCode).toBe(201);

    response = await request(app)
        .get('/api/user?userId=john')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.friends).toContain("simen");

})






