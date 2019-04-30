const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query{
        getUser: [User!]
    }

    type Mutation{
        createNewUser(userId: String!, password: String!, name: String!, surname: String!, dateOfBirth: String, location: String, friends: [String], friendRequest: [String]) : String
    }

    type User{
        userId: String
        password: String
        name: String
        surname: String
        dateOfBirth: String
        location: String
        friends: [String]
        friendRequest: [String]
    }
`;

module.exports = typeDefs;