const UserUtil = require('../../src/client/util/user');
const Timeline = require('../../src/client/util/timeline');

const demoArray = [2,2,4,4,2,2];

test("Test UserUtil", () => {  
    UserUtil.setCurrent(demoArray);
    expect(UserUtil.getCurrent()).toEqual(demoArray);
})

test("Test Timeline", () => {  
    Timeline.setTimeline(demoArray);
    expect(Timeline.getTimeline()).toEqual(demoArray);
})
