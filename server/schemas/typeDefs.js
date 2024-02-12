const typeDefs = `
  type  User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user: User
    book: Book
    books: [Book]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(username: String!, email: String!, password: String!): Auth
    saveBook(bookId: ID!): Book
  }
`
module.exports = typeDefs;