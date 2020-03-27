import React from 'react'
import '../css/index.css'
import {
    Link
} from 'react-router-dom'

interface recipe {
    id: string,
    title: string,
    imageUrl: string
}


interface Props {
    recipes
    searchedRecipes
    search
}

const RecipeList: React.FC<Props> = (props) => {
    const showRecipes1 = props.recipes.data ? props.recipes.data.allRecipes : []
    const showRecipes2 = props.searchedRecipes.data ? props.searchedRecipes.data.searchRecipes : []

    const allRecipes = props.search ? showRecipes2 : showRecipes1

    return (
        <div className='recipelist'>
            {allRecipes && allRecipes.map(r =>
                <div key={r.id} className='recipeCard'>
                    <img className='cardImgContent' src={r.imageUrl !== "" ? `${process.env.REACT_APP_CLOUDFETCHURL}/${r.imageUrl}` : `/images/emptyplate.jpg`} alt='not found'></img>
                    <div className='cardContent' >
                        <strong>{r.title}</strong>
                        <p>
                            {r.creator ? r.creator.username : 'unknown'}<br></br>
                            {r.description}
                        </p>
                        <Link to={"/recipes/" + r.id}><button>To recipe</button></Link>
                    </div>
                </div>
            )}
        </div>
    )

}
export default RecipeList

