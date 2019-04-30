const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');
import Search from '../../src/client/seach';

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

test("Test can draw seach result", () => {

    const results = [];
    results.push(demoUser);

    const driver = mount(
        <MemoryRouter>
            <Search results={results} />
        </MemoryRouter>
    )
    const found = driver.html().includes('John Stone');
    expect(found).toBe(true);


})