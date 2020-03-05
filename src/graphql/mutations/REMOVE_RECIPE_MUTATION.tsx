import gql from 'graphql-tag';

export const REMOVE_RECIPE_MUTATION = gql`
  mutation removeRecipe($id: String!) {
    removeRecipe(id: $id) {
      id
    }
  }
`;
