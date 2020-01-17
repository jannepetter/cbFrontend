import React from 'react'
import gql from 'graphql-tag'
import { useQuery} from "@apollo/react-hooks"


const FIND_RECIPE = gql`
  query findRecipe($id:ID!){
    findRecipe(
      id:$id
    ){
      title
      imageUrl
      ingredients
      id
    }
}
`

interface recipe {
    id: string
    title: string
    imageUrl: string
    ingredients: any
}


interface Props {
    match: { params },
}

const Recipe: React.FC<Props> = (props) => {
    const findRecipe = useQuery(FIND_RECIPE,{
        variables:{id:props.match.params.id}
    })
    //tähän vielä pitää jossainvälissä laittaa että tarkistaa clientin ennenkö lähtee tekee db kyselyä
    //sen jälkee ehkä vois olla viisainta kun oot tehny algoritmin millä hakee alotus respat
    
    if (findRecipe.loading ||findRecipe.data===undefined) {
        return (
            <div></div>
        )
    }
    console.log(findRecipe,'tsektsek')
   /*  return (
        <div></div>
    ) */

    const faker = {
        title: 'notfound',
        imageUrl: '',
        ingredients: ['notfound']
    }
    const recipe = findRecipe.data.findRecipe || faker 
  
    //korjaa ingredientin listauksen key arvo. Nyt tulee aineksen nimestä ja indexista listalla
    //ei onnistu suoraan key={i.id} ehkä talletin kantaan ingredientsit stringina enkä array
    return (
        <div>
            <h2>{recipe.title}</h2>
            <img className='cardImgContent' src={recipe.imageUrl !== "" ? `${process.env.REACT_APP_CLOUDFETCHURL}/${recipe.imageUrl}` : `/images/emptyplate.jpg`} alt='not found'></img>
            <h3>Ingredients</h3>
            {recipe.ingredients.map(i => <li key={`${i}${recipe.ingredients.indexOf(i)}`}>{i}</li>)}
        </div>
    )
}
export default Recipe
