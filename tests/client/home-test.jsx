const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');

const { Home } = require('../../src/client/home');
const { app } = require('../../src/server/app');
const { stubFetch, flushPromises, overrideFetch, asyncCheckCondition } = require('../mytest-utils');
const Posts = require('../../src/server/db/posts');
import Login from '../../src/client/login';


function fillLoginForm(driver, id, password) {
    const userIdInput = driver.find('#userId').at(0);
    const passwordInput = driver.find('#password').at(0);
    const loginBtn = driver.find('#loginBtn').at(0);

    userIdInput.simulate('change', { target: { value: id } });
    passwordInput.simulate('change', { target: { value: password } });
    loginBtn.simulate('click');
}


test("Test fail to fetch post", async () => {
  
    const error = "Please log in to see your home page"
    stubFetch(500, {}, "/api/post");

    const driver = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Home />
        </MemoryRouter>
    );
    await flushPromises();
    const html = driver.html();

    expect(html).toContain(error)
})

test("Test display posts", async () => {
    overrideFetch(app);
    Posts.initWithDemoData();
    
    const updateLoggedInUserId = () => new Promise(resolve => resolve());
    let page = null;
    const history = { push: (h) => { page = h } };

    const driver = mount(
        <MemoryRouter initialEntries={['/api/login']}>
            <Login updateLoggedInUserId={updateLoggedInUserId} history={history} />
        </MemoryRouter>
    );
    fillLoginForm(driver, "john", "password");

    await flushPromises();

    const user = {
        userId: "john",
        password: "password",
        name: "name",
        surname: "surname",
        dateOfBirth: "dateOfBirth",
        location: "location",
        friends: [],
        friendRequest: []
    };

    const driver2 = mount(
        <MemoryRouter initialEntries={["/"]}>
            <Home user={user}/>
        </MemoryRouter>
    );

    await flushPromises();

    const predicate = () => {
        driver2.update();
        
        const postIsDisplayed = driver2.html().includes("Loading");
        return postIsDisplayed;
    };
    const displayPosts = await asyncCheckCondition(predicate, 3000, 200);

    expect(displayPosts).toBe(true);

});

