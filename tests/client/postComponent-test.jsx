const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');

import PostComponent from '../../src/client/postComponent';



const demoPost = {
    authorId: "john",
    title: "title",
    text: "text"
};

test("Test can draw User", () => {


    const driver = mount(
        <MemoryRouter>
            <PostComponent post={demoPost} />
        </MemoryRouter>
    )
    const found = driver.html().includes('title');
    expect(found).toBe(true);


})