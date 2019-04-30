var currentUser = [];


function getCurrent() {
    return currentUser;
}

function setCurrent(usr) {
    currentUser = usr;
}

module.exports = { getCurrent, setCurrent };