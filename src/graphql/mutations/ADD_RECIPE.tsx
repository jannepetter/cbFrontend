import gql from 'graphql-tag';

export const ADD_RECIPE = gql`
  mutation createRecipe(
    $title: String!
    $imageUrl: String
    $ingredients: [String]!
  ) {
    createRecipe(
      title: $title
      imageUrl: $imageUrl
      ingredients: $ingredients
    ) {
      title
      imageUrl
      ingredients
      id
      creator {
        username
      }
    }
  }
`;
