const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');

import { User } from '../../src/client/user';

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

test("Test can draw User", () => {
    

    const driver = mount(
        <MemoryRouter>
            <User user={demoUser} />
        </MemoryRouter>
    )
    const found = driver.html().includes('John Stone');
    expect(found).toBe(true);
    

})