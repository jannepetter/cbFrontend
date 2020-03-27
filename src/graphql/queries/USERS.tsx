import gql from 'graphql-tag'

export const USERS = gql`
  query users($name:String){
    users(name:$name){
      username
      role
      userrecipes{
          title
          id
      }
    }
  }
`;