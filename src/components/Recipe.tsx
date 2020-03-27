import React from 'react'
import '../css/Recipe.css'
import { useQuery } from "@apollo/react-hooks"
import { FIND_RECIPE } from '../graphql/queries/FIND_RECIPE'

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
    const findRecipe = useQuery(FIND_RECIPE, {
        variables: { id: props.match.params.id }
    })
    //tähän vielä pitää jossainvälissä laittaa että tarkistaa clientin ennenkö lähtee tekee db kyselyä
    //sen jälkee ehkä vois olla viisainta kun oot tehny algoritmin millä hakee alotus respat

    if (findRecipe.loading || findRecipe.error) {
        return (
            <div></div>
        )
    }
    const faker = {
        title: 'notfound',
        imageUrl: '',
        ingredients: ['notfound']
    }
    const recipe = findRecipe.data.findRecipe || faker


    return (
        <div>
            <h2>{recipe.title}</h2>
            <img className='cardImgContent' src={recipe.imageUrl !== "" ? `${process.env.REACT_APP_CLOUDFETCHURL}/${recipe.imageUrl}` : `/images/emptyplate.jpg`} alt='not found'></img>
            <h3>Ingredients</h3>
            {recipe.ingredients.map(i => <li key={`${i}${recipe.ingredients.indexOf(i)}`}>{i}</li>)}
            <textarea className='instructionfield' value={recipe.instructions || ''} readOnly={true}></textarea>

        </div>
    )
}
export default Recipe
