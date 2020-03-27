import React, { useState, useEffect } from 'react'

interface Props {
    show
}

const SetRecipeName: React.FC<Props> = (props) => {
    const [recipeName, setRecipeName] = useState<string>('')
    const [desc, setDesc] = useState<string>('')
    const [tag, setTag] = useState<string>('')
    useEffect(() => {
        const name = localStorage.getItem('recipename') ? localStorage.getItem('recipename') : ''
        const rdesc = localStorage.getItem('recipedescription') ? localStorage.getItem('recipedescription') : ''
        const tags = localStorage.getItem('recipeTags') ? localStorage.getItem('recipeTags') : ''
        if (name) {
            setRecipeName(name)
        }
        if (rdesc) {
            setDesc(rdesc)
        }
        if (tags) {
            setTag(tags)
        }
    }, [])

    if (!props.show) {
        return null
    }
    const handleRecipename = (e) => {
        setRecipeName(e.target.value)
        localStorage.setItem('recipename', e.target.value)
    }
    const handleDescription = (e) => {
        setDesc(e.target.value)
        localStorage.setItem('recipedescription', e.target.value)
    }
    const handleTags = (e) => {
        setTag(e.target.value)
        localStorage.setItem('recipeTags', e.target.value)
    }
    return (<div>
        <h2>Recipe name and description</h2>
        <input id='recipenameInput' onChange={handleRecipename} placeholder='recipename' value={recipeName}></input>
        <br></br>
        <textarea className='recipedescription' onChange={handleDescription}
            placeholder='short description of the recipe' value={desc}></textarea>
        <br></br>
        <p>add 1-5 tags to help people find Your recipe</p>
        <input onChange={handleTags} placeholder='eg. vege, dessert, protein' value={tag}></input>
    </div>)
}
export default SetRecipeName