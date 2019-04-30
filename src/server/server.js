const { app } = require('./app');
const { initWithDemoData } = require('./db/posts');
const { initWithDemoUser } = require('./db/users');

const port = process.env.PORT || 8080;

initWithDemoUser();
initWithDemoData();

app.listen(port, () => {
    console.log('Server started on port ' + port);
});