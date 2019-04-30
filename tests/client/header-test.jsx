const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');
const { WebSocket } = require('mock-socket');

const Users = require('../../src/server/db/users');
const HeaderBar = require('../../src/client/header').default;
const { app } = require('../../src/server/app');
const { flushPromises, overrideFetch, asyncCheckCondition } = require('../mytest-utils');


test("Test logged in", () => {

    const userId = "john";

    const driver = mount(
        <MemoryRouter>
            <HeaderBar userId={userId} />
        </MemoryRouter>
    );

    const logoutBtn = driver.find('#logoutBtn').at(0);
    const myInfoBtn = driver.find('#myInfoBtn').at(0);

    expect(logoutBtn.exists).toBeTruthy;
    expect(myInfoBtn.exists).toBeTruthy;
    
});

test("Test logout", async () => {

    overrideFetch(app);

    const userId = "john";
    const user = {
        userId: userId,
        password: "password",
        name: "name",
        surname: "surname",
        dateOfBirth: "dateOfBirth",
        location: "location",
        friends: [],
        friendRequest: []
    };

    const driver = mount(
        <MemoryRouter>
            <HeaderBar user={user} userId={userId} />
        </MemoryRouter>
    );

    const logoutBtn = driver.find('#logoutBtn').at(0);
    logoutBtn.simulate('click');

    await flushPromises();

    const predicate = () => {
        driver.update();
        const loginBtn = driver.find('#loginBtn');
        const loginBtnFound = loginBtn.exists;
        return loginBtnFound;
    };
    const logout = await asyncCheckCondition(predicate, 3000, 200);

    expect(logout).toBe(true);
});


test("Test logged in failed", () => {

    const userId = "john";

    const driver = mount(
        <MemoryRouter>
            <HeaderBar />
        </MemoryRouter>
    );

    const logoutBtn = driver.find('#logoutBtn').at(0);
    const html = driver.html();

    expect(logoutBtn.exists).toBeFalsy;
    expect(html).not.toContain(userId);
});

test("Test toggle chat", async () => {

    global.WebSocket = WebSocket;

    const baseProps = {
        updateRenderChat: jest.fn()
        };

    const driver = mount(
        <MemoryRouter>
            <HeaderBar {...baseProps} />
        </MemoryRouter>
    );
    
    const toggleChatBtn = driver.find('#toogleChatBtn').at(0);
    toggleChatBtn.simulate('click');

    driver.update()
    const content = driver.html();

    expect(jest.fn).toBeCalled;
});


