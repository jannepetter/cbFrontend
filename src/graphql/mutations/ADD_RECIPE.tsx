import gql from 'graphql-tag';

export const ADD_RECIPE = gql`
  mutation createRecipe(
    $title: String!
    $description:String
    $imageUrl: String
    $ingredients: [String]!
    $tags:[String]!
    $instructions:String
  ) {
    createRecipe(
      title: $title
      description: $description
      imageUrl: $imageUrl
      ingredients: $ingredients
      tags:$tags
      instructions:$instructions
    ) {
      title
      description
      imageUrl
      ingredients
      instructions
      id
      creator {
        username
        id
      }
    }
  }
`;
