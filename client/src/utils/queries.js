import {gql} from '@apollo/client';

export const QUERY_CURRENT_USER = gql`
  query currentUser {
    _id
    username
    email
    password
    savedBooks
  }
`;