import gql from 'graphql-tag'
export const ME = gql`
{
  me{
    username
    tokenTime
  }
}
`
