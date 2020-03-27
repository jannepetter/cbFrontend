import gql from 'graphql-tag'

export const FIND_RECIPE = gql`
query findRecipe($id:ID!){
  findRecipe(
    id:$id
  ){
    title
    imageUrl
    ingredients
    id
    instructions
  }
}
`