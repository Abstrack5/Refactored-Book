const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [bookSchema]
    }

    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String!
        image: String
        link: String
    }

    
`;