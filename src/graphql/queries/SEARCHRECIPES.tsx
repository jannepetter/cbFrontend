import gql from 'graphql-tag'

export const SEARCHRECIPES = gql`	
query searchRecipes($name:String!){
  searchRecipes(name:$name) {
    title
    description
    ingredients
    imageUrl
    instructions
    id
    creator {
      username
      id
    }
  }
}
`