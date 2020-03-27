import gql from 'graphql-tag';

export const ALL_RECIPES = gql`
  {
    allRecipes {
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
`;
