const Users = require('../db/users');


module.exports = {

    Query: {
        getUser: (parent, args, context, info) => {
            return Users.getAll();
        }
    },

    Mutation: {
        createNewUser: (parent, args, context, info) => {
            return Users.create(args.userId, args.password, args.name, args.surname,
                 args.dateOfBirth, args.location, args.friends);
        }
    }

}