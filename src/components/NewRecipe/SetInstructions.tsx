import React,{useState,useEffect} from 'react'


interface Ingredient {
    name: string;
    amount: number;
    unit: string;
    id: string;
}
interface Props {
show
}

const SetInstructions:React.FC<Props> = (props) => {
    const [ingredients, setIngredients] = useState<Array<Ingredient>>([])
    useEffect(()=>{
        const fetchedings=localStorage.getItem('ingredients')
        if(fetchedings){
            setIngredients(JSON.parse(fetchedings))
        }
    },[]) 
    if (!props.show) {
        return null
    }

return (<div>
    <h2>Instructions</h2>
    {ingredients.map(i =>
            <li key={i.id}>{i.name} {i.amount} {i.unit}</li>)}
            <textarea className='instructionfield'></textarea>
</div>)
}
export default SetInstructions