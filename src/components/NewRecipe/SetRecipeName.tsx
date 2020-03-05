import React,{useState, useEffect} from 'react'

interface Props {
show
}

const SetRecipeName:React.FC<Props> = (props) => {
    const [recipeName, setRecipeName] = useState<string>('')
    useEffect(()=>{
        const name=localStorage.getItem('recipename')?localStorage.getItem('recipename'):''
        if(name){
            setRecipeName(JSON.parse(name))
        }
    },[])

    if(!props.show){
        return null
    }
    const handleRecipename = (e) => {
        setRecipeName(e.target.value)
        localStorage.setItem('recipename', JSON.stringify(e.target.value))
    }
return (<div>
    <input id='recipenameInput' onChange={handleRecipename} placeholder='recipename' value={recipeName}></input>
</div>)
}
export default SetRecipeName