// From https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/client/login-test.jsx

const React = require('react');
const {mount} = require('enzyme');
const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const {initWithDemoUser} = require('../../src/server/db/users');
const {app} = require('../../src/server/app');
const {MemoryRouter} = require('react-router-dom');

const {Login} = require('../../src/client/login');

beforeEach(() => {
    initWithDemoUser();
});

function fillForm(driver, id, password) {
    const userIdInput = driver.find('#userId').at(0);
    const passwordInput = driver.find('#password').at(0);
    const loginBtn = driver.find('#loginBtn').at(0);

    userIdInput.simulate('change', {target: {value: id}});
    passwordInput.simulate('change', {target: {value: password}});
    loginBtn.simulate('click');
}

test("Test can render login", () =>{
    
    const driver = mount(<Login />);

    let forms = driver.find('#password');
    expect(forms.length).toBe(1);
    
    forms = driver.find('#userId');
    expect(forms.length).toBe(1);
})

test("Test failed login", async () => {
    overrideFetch(app);
    
    const driver = mount(
        <MemoryRouter initialEntries={['/api/login']}>
            <Login />
        </MemoryRouter>
    );
    fillForm(driver, "user", "123");

    const error = await asyncCheckCondition(() => {
        driver.update();
        return driver.html().includes("Invalid userId/password")
    },2000, 200);

    expect(error).toEqual(true);

})

test("Test ok login", async () => {
    overrideFetch(app);

    const updateLoggedInUserId = () => new Promise(resolve => resolve());
    let page = null;
    const history = { push: (h) => { page = h } };

    const driver = mount(
        <MemoryRouter initialEntries={['/api/login']}>
            <Login updateLoggedInUserId={updateLoggedInUserId} history={history}/>
        </MemoryRouter>
    );
    fillForm(driver, "john", "password");

    const redirected = await asyncCheckCondition(
        () => { return page === "/" },
        2000, 200);

    expect(redirected).toEqual(true);

})
