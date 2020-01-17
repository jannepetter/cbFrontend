import React, { useState, useRef, useEffect} from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import shortid from 'shortid'
import '../css/CreateRecipe.css'
import { useApolloClient } from "@apollo/react-hooks"
import { ME } from '../graphql/queries/me'
import { MY_RECIPES } from '../graphql/queries/MY_RECIPES'



interface Ingredient {
    name: string;
    amount: number;
    unit: string;
    id: string;
}

interface Props {
    createRecipe: any,
    me
}

const Create: React.FC<Props> = (props) => {
    const client=useApolloClient()    
    const [ingredients, setIngredients] = useState<Array<Ingredient>>([])
    const [ingredientName, setIngredientName] = useState('')
    const [amount, setAmount] = useState('')
    const [unit, setUnit] = useState('')
    const [recipeName, setRecipeName] = useState('')
    const [file, setFile] = useState<any>('')
    const [imgpreview, setImagepreview] = useState<any>()
    const [errmessage, setErrmessage] = useState('')

    const renders = useRef(0)
    console.log(renders.current++, 'Createreciperenders');
    useEffect(() => {
        const ingsbeginning = localStorage.getItem('ingredients')
        const name=localStorage.getItem('recipename')
        if (ingsbeginning) {
            setIngredients(JSON.parse(ingsbeginning))
        }
        if(name){
            setRecipeName(name)
        }
    }, [])

    const handleIngredientsubmit = async (event) => {
        event.preventDefault()
        try {
            let amountOfIngredient = parseFloat(amount)
            if (isNaN(amountOfIngredient)) {
                throw new Error('amount must be a number, like 4, 10 or 5.2')
            }

            const createId = shortid.generate()
            const newIngredient = {
                name: ingredientName,
                amount: Math.round(amountOfIngredient * 100) / 100,
                unit: unit,
                id: createId
            }
            localStorage.setItem('ingredients', JSON.stringify(ingredients.concat(newIngredient)))
            setIngredients(ingredients.concat(newIngredient))
            setIngredientName('')
            setAmount('')
            setUnit('')
            let hidingRadiobutton = document.getElementById('Radio5') as HTMLInputElement
            if (hidingRadiobutton) {
                hidingRadiobutton.checked = true
            }
        } catch (error) {
            setErrmessage(error.message)
            setTimeout(() => {
                setErrmessage('')
            }, 3000);
        }

    }

    const handleremove = (id) => {
        const filteredIngList = ingredients.filter(i => i.id !== id)
        localStorage.setItem('ingredients', JSON.stringify(filteredIngList))
        setIngredients(filteredIngList)
    }

    const fileSelectedHandler = async (event) => {
        event.preventDefault()
        const fileSize=event.target.files[0].size
        if(fileSize >10512530){
            const form =document.getElementById('fileInput') as HTMLInputElement
            form.value=''
            setFile('')
            setImagepreview('')
            alert('Its too big')
        }else{
            setImagepreview(URL.createObjectURL(event.target.files[0]))
            setFile(event.target.files[0])
            console.log(fileSize, 'iiiimake sizee')
        }
    }

    const handlesubmit = async (event) => {
        event.preventDefault()
        const preset = process.env.REACT_APP_UPLOAD_PRESET ? process.env.REACT_APP_UPLOAD_PRESET : ''
        const cloudurl = process.env.REACT_APP_CLOUDURL ? process.env.REACT_APP_CLOUDURL : ''
        /* await client.resetStore() */   //ei itseasiassa poista kaikkea vaan hakee ne uudestaan
        await props.me.refetch()            //hakee vaan me queryn               
        const currentUser =client.readQuery({ query:ME });  
        if(currentUser.me!==null){
            try {
                let imageUrl = ''
                if (file) {
                    const fd = new FormData()
                    fd.append('file', file)
                    fd.append('upload_preset', preset)
                    const response = await axios.post(
                        `${cloudurl}/upload`, fd
                    )
                    imageUrl = response.data.public_id
                }
                /* const ingredients = ings.map(i => i.name) */
                console.log(ingredients,'miltä inggssit näyttää')
                const shit=ingredients.map(i=>i.name)
                const title = recipeName
                await props.createRecipe({
                    variables: { title, imageUrl, ingredients:shit }
                })
                setIngredientName('')
                setAmount('')
                let form = document.getElementById('recipe') as HTMLFormElement
                if (form) {
                    form.reset()
                }
                localStorage.removeItem('ingredients');
                localStorage.removeItem('recipename');
            } catch (error) {
                console.log(error.message, 'create resipessä tapahtuupi');
            }
        }
    }
    const handleIngredientNameChange = (event) => {
        setIngredientName(event.target.value)
    }
    const handleAmountChange = (event) => {
        setAmount(event.target.value)
    }
    const tokenexpired = () => {
        localStorage.clear()
        client.writeQuery({
            query: MY_RECIPES,
            data: { myRecipes: [] }
          })
        /* props.myRecipes.refetch() */ //hakee servulta asti
        return <Redirect to='/' />
    }
    const handleRecipename=(e)=>{
        setRecipeName(e.target.value)
        localStorage.setItem('recipename', JSON.stringify(e.target.value))
    }
    const revokeObjectUrl=()=>{
        setImagepreview(URL.revokeObjectURL(imgpreview))
        setFile('')
    }

    const imageInstructions="max 10MB, jpg/jpeg/png"


    return (
        <div>
            <h2>Share a recipe</h2>
            <form id='recipe' onSubmit={handlesubmit}>
                <input placeholder='Recipe name' onChange={handleRecipename} ></input><br></br>
                {file===''?<input id='fileInput' type='file' accept='image/jpg,image/jpeg,image/png' onChange={fileSelectedHandler}></input>:null}
                {file!==''?<button onClick={revokeObjectUrl}>change image</button>:null}<br></br>
                <img className='cardImgContent' src={imgpreview} alt={imageInstructions}></img><br></br>
                <h3>{recipeName}</h3>
                {ingredients.map(i =>
                    <li key={i.id}>{i.name} {i.amount} {i.unit}
                        <button onClick={() => handleremove(i.id)}>remove</button></li>)}
                {!props.me.data.me ? tokenexpired() : null}
                <input id='inginput' placeholder='ingridient name' value={ingredientName} onChange={handleIngredientNameChange}></input>
                <label>{errmessage}</label><br></br>

                <div>
                    <input id='amountinput' placeholder='amount' value={amount} onChange={handleAmountChange} style={{ width: "60px" }}></input>
                    <span>
                        <input onChange={(event) => setUnit(event.target.value)} id="Radio1" name="Radios" type="radio" value="g" />
                        <label htmlFor="Radio1"> g </label>
                    </span>
                    <span>
                        <input onChange={(event) => setUnit(event.target.value)} id="Radio2" name="Radios" type="radio" value="dl" />
                        <label htmlFor="Radio2">dl</label>
                    </span>
                    <span>
                        <input onChange={(event) => setUnit(event.target.value)} id="Radio3" name="Radios" type="radio" value="tbs" />
                        <label htmlFor="Radio3">tbs</label>
                    </span>
                    <span>
                        <input onChange={(event) => setUnit(event.target.value)} id="Radio4" name="Radios" type="radio" value="jee" />
                        <label htmlFor="Radio4">jee</label>
                    </span>
                    <span style={{ display: 'none' }}>
                        <input onChange={(event) => setUnit(event.target.value)} id="Radio5" name="Radios" type="radio" value="" />
                        <label htmlFor="Radio5">juu</label>
                    </span>
                </div>

                <button onClick={handleIngredientsubmit}>add to Ingriedients</button><br></br>
                <pre >{ingredientName + " " + amount + " " + unit}</pre>
                <button type='submit'>create recipe</button>
            </form>


        </div>
    )
}
export default Create

