import gql from 'graphql-tag'

export const MY_RECIPES = gql`	
{
  myRecipes {
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