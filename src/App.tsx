import React, { useState, useEffect, useRef } from 'react'; 
import RecipeList from './components/RecipeList';
import Recipe from './components/Recipe'
import Login from './components/Login'
import CreateRecipe from './components/CreateRecipe'
import MyRecipes from './components/MyRecipes'
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom'
import Header from './components/Header';
import gql from 'graphql-tag'
import { useQuery, useMutation, /* useSubscription, */ useApolloClient } from "@apollo/react-hooks"
import NewAcc from './components/NewAccount';
import { ME } from './graphql/queries/me'
import MenuBar from './components/MenuBar';
import SideDrawer from './components/SideDrawer'
import Backdrop from './components/Backdrop'
import { MY_RECIPES } from './graphql/queries/MY_RECIPES'

/*
f2 antaa nimetä kaikki muuttujat kerralla
shift+alt+a kommentoi ulos blokin koodia
ctrl+lclick(mouse) kohdistaa kohteen syntypaikalle, funktioon, komponenttiin ym
jwt.io webpage kertoo mitä tokeni sisältää, asia joka ainaki kannattaa pitää mielessä
yritä tehdä funktiot puhtaina eli etteivät käytä muuta tietoa kuin mitä saavat parametreinaan
(tsekkaa immer -kirjasto ja sen produce funktio jos pitää tehdä syvälle nestattuja cacheupdateja)
//tsekkaa content security policy csp, ilmeisesti estää osan xss hyökkäyksistä


uudet snippetsit:
rh tekee uuden react componentin
aa const arrowfuntio
cl consolelog
*/

//todo graphql quaryrajotukset syvyyteen ja leveyteen
//tsek webhint.io 
//query complexity (cost analysis)



interface recipe {
  id: string 
  title: string
  image: string
  imageUrl: string
  ingredients: string[]
}



const ALL_RECIPES = gql`	
{
  allRecipes {
    title
    ingredients
    imageUrl
    id
    creator{
      username
    }
  }
}
`
/* const ME = gql`
{
  me{
    username
    token
    id
  }
}
` */
const ADD_RECIPE = gql`
    mutation createRecipe($title:String!,$imageUrl:String,$ingredients:[String]!){
      createRecipe(
        title:$title,
        imageUrl:$imageUrl,
        ingredients:$ingredients
      ){
        title
        imageUrl
        ingredients
        id
        creator{
          username
        }
      }
    }
`

const REMOVE_RECIPE_MUTATION = gql`
mutation removeRecipe($id:String!){
  removeRecipe(id:$id){
    id
  }
}
`
const NEW_USER_MUTATION = gql`
mutation createUser($username:String!, $password:String!, $email:String!){
  createUser(
    username:$username,
    password:$password,
    email:$email
    ){
    username,
  }
}
`
const LOGIN = gql`
mutation login($email:String!, $password:String!){
  login(
    email:$email,
    password:$password
    ){
      value
      username
      tokenTime
    }
}
`
const LOGOUT_MUTATION = gql`
mutation {
  logout
}
`

const App: React.FC = () => {
  const client = useApolloClient()
  const [time, setTime] = useState<number | null>(null)
  const [sideDrawerOpen, setsideDrawerOpen] = useState(false)
  
  const recipes = useQuery(ALL_RECIPES)
  const me = useQuery(ME)
  const myRecipes = useQuery(MY_RECIPES)
  const [createRecipe] = useMutation(ADD_RECIPE, {
    refetchQueries: [{ query: ME }],
    update: (store, response) => {
      console.log(response.data,'nyt päivitetään muuisttii')
      try {
        const myRecipesInStore: any = store.readQuery({ query: MY_RECIPES })
        const newMyRecipes = myRecipesInStore.myRecipes.concat(response.data.createRecipe)
        store.writeQuery({
          query: MY_RECIPES,
          data: { myRecipes: newMyRecipes }
        })

        const allRecipesInStore: any = store.readQuery({ query: ALL_RECIPES })
        const newAllrecipes = allRecipesInStore.allRecipes.concat(response.data.createRecipe)
        store.writeQuery({
          query: ALL_RECIPES,
          data: { allRecipes: newAllrecipes }
        })
      } catch (error) {
        console.log(error, 'app häppness')
      }
    }
  })
  const [removeRecipe] = useMutation(REMOVE_RECIPE_MUTATION, {
    refetchQueries: [{ query: ME }],
    update: (store, response) => {
      try {
        const myRecipesInStore: any = store.readQuery({ query: MY_RECIPES })
        const newMyrecipes = myRecipesInStore.myRecipes.filter(r => r.id !== response.data.removeRecipe.id)
        store.writeQuery({
          query: MY_RECIPES,
          data: { myRecipes: newMyrecipes }
        })
        const allRecipesInStore: any = store.readQuery({ query: ALL_RECIPES })
        const newAllrecipes = allRecipesInStore.allRecipes.filter(r => r.id !== response.data.removeRecipe.id)
        store.writeQuery({
          query: ALL_RECIPES,
          data: { allRecipes: newAllrecipes }
        })
      } catch (error) {
        console.log(error, 'myrecipesss')
      }
    }
  })
  
  const [createUser] = useMutation(NEW_USER_MUTATION)
  const [login] = useMutation(LOGIN, {
    refetchQueries: [{ query: ME },{query: MY_RECIPES}],
  })

  const [logout] = useMutation(LOGOUT_MUTATION, {
    refetchQueries: [{ query: ME }],
    update: (store, response) => {
      try {
        store.writeQuery({
          query: MY_RECIPES,
          data: { myRecipes: [] }
        })
      } catch (error) {
        console.log(error, 'logout')
      }
    }
  })

  useEffect(() => {
    console.log(me.loading, 'me.loading')
    if (me.loading === false && !me.error) {
      const datame = client.readQuery({ query: ME })
      if (datame.me !== null) {
        console.log(datame.me, 'klientti luetaa')
        setTime(datame.me.tokenTime)
      }
    }
  }, [client,me])
  const renders = useRef(0)
  console.log(renders.current++, 'apprenders');

  const toggleSideDrawer = () => {
    setsideDrawerOpen(!sideDrawerOpen)
  }

  if (me.loading || recipes.loading || myRecipes.loading) {
    return (<div></div>)
  }
 
  if(me.error){
    return(<div>{me.error}</div>)
  }
  if(myRecipes.error){
    return(
      <div>{myRecipes.error.graphQLErrors[0].message}</div>
    )
  }
  if(recipes.error){
    return(
      <div>{recipes.error.graphQLErrors[0].message}</div>
    )
  }
  return (
    <div >
      <Router>
        <Backdrop toggleSideDrawer={toggleSideDrawer} sideDrawerOpen={sideDrawerOpen}></Backdrop>
        <SideDrawer me={me} sideDrawerOpen={sideDrawerOpen}></SideDrawer>
        <MenuBar toggleSideDrawer={toggleSideDrawer} logout={logout} time={time} me={me}></MenuBar>
        <Header></Header>
        <Switch>
          <Route exact path='/log'><Login setTime={setTime}  login={login}></Login></Route>
          <Route exact path='/createNew'><NewAcc createUser={createUser}></NewAcc></Route>
          <Route exact path='/'><RecipeList recipes={recipes}></RecipeList></Route>
          <Route exact path='/myRecipes'><MyRecipes myRecipes={myRecipes} removeRecipe={removeRecipe} me={me}  ></MyRecipes></Route>
          <Route exact path='/createRecipe'><CreateRecipe me={me} createRecipe={createRecipe} ></CreateRecipe></Route>
          <Route exact path='/recipes/:id' render={(props) => <Recipe {...props} />} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;
