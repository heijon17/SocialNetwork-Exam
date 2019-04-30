const request = require('supertest');
const app = require('../../src/server/app').app;
const Users = require('../../src/server/db/users');
const Posts = require('../../src/server/db/posts');


const errorHandler = function (err, req, res, next) {
    console.log(err.stack);
    res.send(500);
};
app.use(errorHandler);


beforeEach(() => {
    Users.initWithDemoUser();
    Posts.initWithDemoData();
   
});



test("Test get dish", async () => {
    
    const payload = { userId: 'john', password: 'password' };
    let response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    response = await request(app)
        .get('/api/post')
        .set('cookie', cookie)
    expect(response.statusCode).toBe(200);
    expect(response.body[0].title).toContain("Hello");
    
})

test("Test add and get Post", async () => {
    Posts.clear();
    let response = await request(app)
        .post('/api/login')
        .send({ userId: "john", password: "password" });
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    const payload = {
        title: "something",
        text: "posttext",
        author: "john"
    }

    response = await request(app)
        .post('/api/post')
        .set('cookie', cookie)
        .send(payload)
    expect(response.statusCode).toBe(201);

    response = await request(app)
        .get('/api/post')
        .set('Cookie', cookie)
    expect(response.body[0].title).toEqual(payload.title);
});

