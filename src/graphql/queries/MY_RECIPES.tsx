import gql from 'graphql-tag'

export const MY_RECIPES = gql`	
{
  myRecipes {
    title
    ingredients
    imageUrl
    id
  }
}
`