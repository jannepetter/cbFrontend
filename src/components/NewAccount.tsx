import React,{useState} from 'react'

interface Props {
createUser
}

const NewAcc:React.FC<Props> = (Props) => {
    const [username, setUsername] = useState<String>('')
    const [password, setPassword] = useState<String>('')
    const [email, setEmail] = useState<String>('')


    const handleCreate =async(event)=>{
    event.preventDefault()
    try {
       const user= await Props.createUser({
            variables:{username,password,email}
        })
        console.log(user.data,'uuseri')

    } catch (error) {
        console.log(error,'Newacc createuser errrorrrr')
    }
    }
return (
    <div>
<h2>Create account</h2>
            <input placeholder='email' onChange={(event)=>setEmail(event.target.value)} ></input><br></br>
            <input placeholder='username' onChange={(event)=>setUsername(event.target.value)}></input><br></br>
            <input type='password' placeholder='password' onChange={(event)=>setPassword(event.target.value)}></input><br></br>
            <button onClick={handleCreate}>Create</button><br></br>
    </div>
    )
}
export default NewAcc