const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');
const { stubFetch, flushPromises, overrideFetch, asyncCheckCondition } = require('../mytest-utils');
const { app } = require('../../src/server/app');
import MyInfo from '../../src/client/myInfo';
const Users = require('../../src/server/db/users');


const demoUser = {
    userId: "john",
    password: "password",
    name: "John",
    surname: "Stone",
    dateOfBirth: "dateOfBirth",
    location: "location",
    friends: ["none"],
    friendRequest: []
};

test("Test can draw myInfo", () => {
    overrideFetch(app);
    Users.initWithDemoUser();

    const driver = mount(
        <MemoryRouter>
            <MyInfo user={demoUser} />
        </MemoryRouter>
    )
    const found = driver.html().includes('No posts by this user.');
    expect(found).toBe(true);

})

test("Test failed fetch", async () => {
    overrideFetch(app);
    Users.initWithDemoUser();

    const driver = mount(
        <MemoryRouter>
            <MyInfo user={demoUser} />
        </MemoryRouter>
    )

    const error = await asyncCheckCondition(() => {
        driver.update();
        return driver.html().includes('No posts by this user.');
    }, 2000, 200);

    expect(error).toEqual(true);
})

test("test stubFetch", async () => {

    
    const driver = mount(
        <MemoryRouter>
            <MyInfo />
        </MemoryRouter>
        )   
        
        stubFetch(401, {demoUser}, '/api/user?authorId=' + demoUser.userId);
        await flushPromises();

        
        const html = driver.html();
    expect(html).toContain('No posts by this user.');
})