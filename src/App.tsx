import React, { useState, useEffect, useRef } from 'react';
import RecipeList from './components/RecipeList';
import Recipe from './components/Recipe';
import Login from './components/Login';
import NewRecipe from './components/NewRecipe/NewRecipe';
import MyRecipes from './components/MyRecipes';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import {
  useQuery,
  useMutation,
  useLazyQuery,
  /* useSubscription, */ useApolloClient
} from '@apollo/react-hooks';
import NewAcc from './components/NewAccount';
import { ME } from './graphql/queries/me';
import MenuBar from './components/MenuBar';
import SideDrawer from './components/SideDrawer';
import Backdrop from './components/Backdrop';
import { MY_RECIPES } from './graphql/queries/MY_RECIPES';
import { ALL_RECIPES } from './graphql/queries/ALL_RECIPES';
import { SEARCHRECIPES } from './graphql/queries/SEARCHRECIPES'
import { ADD_RECIPE } from './graphql/mutations/ADD_RECIPE';
import { REMOVE_RECIPE_MUTATION } from './graphql/mutations/REMOVE_RECIPE_MUTATION';
import { NEW_USER_MUTATION } from './graphql/mutations/NEW_USER_MUTATION';
import { LOGIN } from './graphql/mutations/LOGIN';
import { LOGOUT_MUTATION } from './graphql/mutations/LOGOUT_MUTATION';
import { USERS } from './graphql/queries/USERS'

import Apanel from './components/Apanel';

/*
-redis hyytyny backistä, laita kuntoon ku ehit
*/

interface recipe {
  id: string;
  title: string;
  image: string;
  imageUrl: string;
  ingredients: string[];
}

const App: React.FC = () => {
  const client = useApolloClient();
  const [time, setTime] = useState<number | null>(null);
  const [sideDrawerOpen, setsideDrawerOpen] = useState(false);
  const [search, setSearch] = useState(false)
  /*  const searchedRecipes = useQuery(SEARCHRECIPES, {
     variables: { name: search }
   }) */
  const [getSearchedRecipes, searchedRecipes] = useLazyQuery(SEARCHRECIPES)
  const recipes = useQuery(ALL_RECIPES);
  const me = useQuery(ME);
  const myRecipes = useQuery(MY_RECIPES);
  const [createRecipe] = useMutation(ADD_RECIPE, {
    refetchQueries: [{ query: ME }],
    update: (store, response) => {
      console.log(response.data, 'muistiupdate');
      try {
        const myRecipesInStore: any = store.readQuery({ query: MY_RECIPES });
        const newMyRecipes = myRecipesInStore.myRecipes.concat(
          response.data.createRecipe
        );
        store.writeQuery({
          query: MY_RECIPES,
          data: { myRecipes: newMyRecipes }
        });

        const allRecipesInStore: any = store.readQuery({ query: ALL_RECIPES });
        const newAllrecipes = allRecipesInStore.allRecipes.concat(
          response.data.createRecipe
        );
        store.writeQuery({
          query: ALL_RECIPES,
          data: { allRecipes: newAllrecipes }
        });
      } catch (error) {
        console.log(error, 'app häppening');
      }
    }
  });
  const [removeRecipe] = useMutation(REMOVE_RECIPE_MUTATION, {
    refetchQueries: [{ query: ME }],
    update: (store, response) => {
      try {
        const myRecipesInStore: any = store.readQuery({ query: MY_RECIPES });
        const newMyrecipes = myRecipesInStore.myRecipes.filter(
          r => r.id !== response.data.removeRecipe.id
        );
        store.writeQuery({
          query: MY_RECIPES,
          data: { myRecipes: newMyrecipes }
        });
        const allRecipesInStore: any = store.readQuery({ query: ALL_RECIPES });
        const newAllrecipes = allRecipesInStore.allRecipes.filter(
          r => r.id !== response.data.removeRecipe.id
        );
        store.writeQuery({
          query: ALL_RECIPES,
          data: { allRecipes: newAllrecipes }
        });
      } catch (error) {
        console.log(error, 'myrecipesss');
      }
    }
  });

  const [createUser] = useMutation(NEW_USER_MUTATION);
  const [login] = useMutation(LOGIN, {
    refetchQueries: [{ query: ME }, { query: MY_RECIPES }]
  });

  const [logout] = useMutation(LOGOUT_MUTATION, {
    refetchQueries: [{ query: ME }],
    update: (store, response) => {
      try {
        store.writeQuery({
          query: MY_RECIPES,
          data: { myRecipes: [] }
        });
        store.writeQuery({
          query: USERS,
          data: { users: [] }
        });
      } catch (error) {
        console.log(error, 'logout');
      }
    }
  });

  useEffect(() => {
    console.log(me.loading, 'me.loading');
    if (me.loading === false && !me.error) {
      const datame = client.readQuery({ query: ME });
      if (datame.me !== null) {
        console.log(datame.me, 'klientti luetaa');
        setTime(datame.me.tokenTime);
      }
    }
  }, [client, me]);
  const renders = useRef(0);
  console.log(renders.current++, 'apprenders');

  const toggleSideDrawer = () => {
    setsideDrawerOpen(!sideDrawerOpen);
  };

  if (me.loading || recipes.loading || myRecipes.loading) {
    return <div></div>;
  }

  if (me.error) {
    console.log(me.error);
    return <div>something happened</div>;
  }
  if (myRecipes.error) {
    return <div>{myRecipes.error.graphQLErrors[0].message}</div>;
  }
  if (recipes.error) {
    return <div>{recipes.error.graphQLErrors[0].message}</div>;
  }

  return (
    <div>
      <Router>
        <Backdrop
          toggleSideDrawer={toggleSideDrawer}
          sideDrawerOpen={sideDrawerOpen}
        ></Backdrop>
        <SideDrawer me={me} sideDrawerOpen={sideDrawerOpen}></SideDrawer>
        <MenuBar
          toggleSideDrawer={toggleSideDrawer}
          logout={logout}
          time={time}
          me={me}
          getSearchedRecipes={getSearchedRecipes}
          setSearch={setSearch}
        ></MenuBar>
        <Header></Header>
        <Switch>
          <Route exact path="/NewRecipe">
            <NewRecipe me={me} createRecipe={createRecipe}></NewRecipe>
          </Route>
          <Route exact path="/log">
            <Login setTime={setTime} login={login}></Login>
          </Route>
          <Route exact path="/createNew">
            <NewAcc createUser={createUser}></NewAcc>
          </Route>
          <Route exact path="/">
            <RecipeList
              recipes={recipes}
              searchedRecipes={searchedRecipes}
              search={search}
            ></RecipeList>
          </Route>
          <Route exact path="/myRecipes/admin">
            <Apanel
              me={me}
              removeRecipe={removeRecipe}
            ></Apanel>
          </Route>
          <Route exact path="/myRecipes">
            <MyRecipes
              myRecipes={myRecipes}
              removeRecipe={removeRecipe}
              me={me}
            ></MyRecipes>
          </Route>
          {/*  <Route exact path="/createRecipe">
            <CreateRecipe me={me} createRecipe={createRecipe}></CreateRecipe>
          </Route> */}
          <Route
            exact
            path="/recipes/:id"
            render={props => <Recipe {...props} />}
          />
        </Switch>
      </Router>
    </div>
  );
};
export default App;
