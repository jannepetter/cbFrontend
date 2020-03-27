import React from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ME } from '../graphql/queries/me';
import { MY_RECIPES } from '../graphql/queries/MY_RECIPES';
import { useApolloClient } from '@apollo/react-hooks';

interface Props {
  me;
  removeRecipe;
  myRecipes;
}

const MyRecipes: React.FC<Props> = props => {
  const client = useApolloClient();

  let recipes: any;
  /*   let errMessage:string|null=null
    if (props.myRecipes.error) {
        recipes=[]
        errMessage=props.myRecipes.error.graphQLErrors[0].message
    }else{ */
  const result = client.readQuery({ query: MY_RECIPES });
  recipes = result.myRecipes ? result.myRecipes : [];
  /*  } */
  const tokenexpired = () => {
    localStorage.clear(); //koska me on null kun tämä suoritetaan niin poistaa muistista nämä
    /* props.myRecipes.refetch() */ client.writeQuery({
      //taloudellisempi tapa tehdä edellinen(edellinen bad example muistutus)
      query: MY_RECIPES,
      data: { myRecipes: [] }
    });
    return <Redirect to="/" />;
  };
  const handleRemove = async id => {
    /* await client.resetStore() */ //ei itseasiassa poista kaikkea vaan hakee ne uudestaan
    props.me.refetch(); //ja saadaan tietää onko user vielä paikalla
    const currentUser = client.readQuery({ query: ME });
    console.log(currentUser, 'currentuser myrecipenpoistossa');
    if (currentUser.me !== null) {
      try {
        const removed = await props.removeRecipe({
          variables: { id }
        });
        return removed; //jotta saadaan appissa välimuisti päivitettyä
      } catch (error) {
        console.log(error, 'resipenpoistoerroria');
      }
    }
  };

  return (
    <div>
      <h2>MyRecipes</h2>
      {/*  {errMessage} */}
      <div className="recipelist">
        {recipes &&
          recipes.map(r => (
            <div key={r.id} className="recipeCard">
              <img
                className="cardImgContent"
                src={
                  r.imageUrl !== ''
                    ? `${process.env.REACT_APP_CLOUDFETCHURL}/${r.imageUrl}`
                    : `/images/emptyplate.jpg`
                }
                alt="not found"
              ></img>
              <div className="cardContent">
                <strong>{r.title}</strong>
                <p>
                  {r.creator ? r.creator.username : 'unknown'}
                  <br></br>
                  {r.description}
                </p>
                <Link to={'/recipes/' + r.id}>
                  <button>To recipe</button>
                </Link>
                <button onClick={() => handleRemove(r.id)}>remove</button>
              </div>
            </div>
          ))}
        {!props.me.data.me ? tokenexpired() : null}
      </div>
    </div>
  );
};
export default MyRecipes;
