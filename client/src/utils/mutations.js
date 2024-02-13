import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
mutation Login($password: String!, $username: String, $email: String) {
    login(password: $password, username: $username, email: $email) {
      token
      user {
        username
        _id
        email
        bookCount
        savedBooks {
          authors
          description
          bookId
          image
          link
          title
        }
      }
    }
  }`;

export const ADD_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        username
        email
        _id
        bookCount
        savedBooks {
          authors
          description
          bookId
          image
          link
          title
        }
      }
    }
  }`;

export const SAVE_BOOK = gql`
  mutation SaveBook($book: bookInput!) {
    saveBook(book: $book) {
      username
      email
      _id
      bookCount
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
mutation RemoveBook($bookId: String!) {
  removeBook(bookId: $bookId) {
    username
    email
    _id
    bookCount
  }
}
`;