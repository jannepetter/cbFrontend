import React from 'react'
import { Card } from 'react-bootstrap'
import '../css/index.css'
import {				
     Link
  } from 'react-router-dom'

interface recipe {
    id: string,
    title: string,
    imageUrl: string
}

/* interface result{
loading:boolean,
data:{allRecipes:Array<recipe>}
} */
interface Props{
    recipes
}

const RecipeList: React.FC<Props> = (props) => { 

const allRecipes=props.recipes.data?props.recipes.data.allRecipes:[]



return(
    <div className='recipelist'>
    {allRecipes && allRecipes.map(r =>
        <Card key={r.id} className='recipeCard'>
            <Card.Img className='cardImgContent'  src={r.imageUrl!==""?`${process.env.REACT_APP_CLOUDFETCHURL}/${r.imageUrl}`:`/images/emptyplate.jpg` }  alt='no image added'></Card.Img>
            <Card.Body className='cardContent' >
                <Card.Title><strong>{r.title}</strong></Card.Title>
                <Card.Text>
                    {r.creator?r.creator.username:'unknown'}<br></br>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                </Card.Text>
               <Link to={"/recipes/"+r.id}><button>To recipe</button></Link> 
            </Card.Body>
        </Card>
    )}
</div>
) 

}
export default RecipeList

