// From https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/client/signup-test.jsx

const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');

const { overrideFetch, asyncCheckCondition } = require('../mytest-utils');
const { app } = require('../../src/server/app');

import SignUp from '../../src/client/signup';
const Users = require('../../src/server/db/users');


beforeEach(() => {
    Users.initWithDemoUser()
});


function fillForm(driver, id, password, confirm) {

    const userIdInput = driver.find("#userIdInput").at(0);
    const passwordInput = driver.find("#passwordInput").at(0);
    const confirmInput = driver.find("#confirmInput").at(0);
    const nameInput = driver.find("#nameInput").at(0);
    const surnameInput = driver.find("#surnameInput").at(0);
    const dobInput = driver.find("#dobInput").at(0);
    const locationInput = driver.find("#locationInput").at(0);
    const signUpBtn = driver.find("#signUpBtn").at(0);


    userIdInput.simulate('change', { target: { value: id } });
    passwordInput.simulate('change', { target: { value: password } });
    confirmInput.simulate('change', { target: { value: confirm } });
    nameInput.simulate('change', { target: { value: "test" } });
    surnameInput.simulate('change', { target: { value: "test" } });
    dobInput.simulate('change', { target: { value: "test" } });
    locationInput.simulate('change', { target: { value: "test" } });

    signUpBtn.simulate('click');
}

test("Test password mismatch", async () => {

    const mismatch = "Not matching";

    overrideFetch(app);

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <SignUp />
        </MemoryRouter>
    );

    expect(driver.html().includes(mismatch)).toEqual(false);

    fillForm(driver, "foo", "123", "not-matching");

    const error = await asyncCheckCondition(
        () => { driver.update(); return driver.html().includes(mismatch) },
        2000, 200);

    expect(error).toEqual(true);
});


test("Create user", async () => {

    const userId = "Foo";
    expect(Users.get(userId)).toEqual(undefined);

    overrideFetch(app);

    const updateLoggedInUserId = () => new Promise(resolve => resolve());
    let page = null;
    const history = { push: (h) => { page = h } };

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <SignUp updateLoggedInUserId={updateLoggedInUserId} history={history} />
        </MemoryRouter>
    );

    const password = "123";

    fillForm(driver, userId, password, password);


    const redirected = await asyncCheckCondition(
        () => { return page === "/" },
        2000, 200);

    

    expect(Users.get(userId).userId).toEqual(userId);
});


test("Fail if user already exists", async () => {

    const userId = "Foo";
    const password = "123";
    Users.create(userId, password);

    overrideFetch(app);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = { push: (h) => { page = h } };

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <SignUp fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} history={history} />
        </MemoryRouter>
    );

    fillForm(driver, userId, password, password);

    const failed = await asyncCheckCondition(
        () => { driver.update(); return driver.html().includes('Invalid userId/password') },
        2000, 200);

    expect(failed).toEqual(true);
});