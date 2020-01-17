import gql from 'graphql-tag'
export const ALL_RECIPES = gql`	
{
  allRecipes {
    title
    ingredients
    imageUrl
    id
  }
}
`