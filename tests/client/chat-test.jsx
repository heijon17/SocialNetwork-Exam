const React = require('react');
const { mount } = require('enzyme');

const { Chat } = require('../../src/client/chat');
const { app } = require('../../src/server/app');

const { overrideFetch, asyncCheckCondition } = require('../mytest-utils');

const { WebSocket } = require('mock-socket');

let server;
let port;

beforeAll( done => {
    server = app.listen(0, () => {
        port = server.address().port;
        done();
    });
    global.WebSocket = WebSocket;
});

afterAll(() => {
    server.close();
});

test("Test new messages", async () => {

    overrideFetch(app);
    

    const driver = mount(<Chat />);

    const msg = "Hello!";

    const predicate = () => {
        driver.update();
        const html = driver.html();
        return html.includes(msg);
    };

    let displayedMessage;


    const nameInput = driver.find('#inputName').at(0);
    const msgInput = driver.find('#inputMsg').at(0);
    const sendBtn = driver.find('#sendId').at(0);

    nameInput.simulate('change', { target: { value: "foo" } });
    msgInput.simulate('change', { target: { value: msg } });
    sendBtn.simulate('submit');


    displayedMessage = await asyncCheckCondition(predicate, 3000, 100);
    expect(displayedMessage).toBe(true);
});