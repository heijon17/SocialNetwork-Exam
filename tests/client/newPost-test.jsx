const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');

const { NewPost } = require('../../src/client/newPost');
const { app } = require('../../src/server/app');
const { stubFetch, flushPromises, overrideFetch, asyncCheckCondition } = require('../mytest-utils');
const request = require('supertest');
const Users = require('../../src/server/db/users');

function fillForm(driver, title, message) {
    const inputTitle = driver.find('#inputTitle').at(0);
    const inputMessage = driver.find('#inputMsg').at(0);
    const sendBtn = driver.find('#sendBtn').at(0);
    
    inputTitle.simulate('change', { target: { value: title} });
    inputMessage.simulate('change', { target: { value: message } });
    sendBtn.simulate('click');
}

test("Test Add new post, but cannot due to cookie", async () => {
    Users.initWithDemoUser();
    overrideFetch(app)



    const testPost = {
        title: "title",
        text: "text", 
        author: "author"
    }

    const driver = mount(
        <MemoryRouter initialEntries={['/newpost']}>
            <NewPost userId={testPost.author} history={[]} />
        </MemoryRouter>
    );
    fillForm(driver, testPost.title, "")
    expect(driver.html()).toContain("You need to type both title and message.")

    fillForm(driver, testPost.title, testPost.text);
    
    const response = await request(app)
        .get('/api/post')
    
    expect(response.status).toBe(401);
    expect(response.body).toEqual({});
    expect(driver.html()).toContain("You need to log in first");
});
