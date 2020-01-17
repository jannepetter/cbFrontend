import React, { useState } from 'react'
import {
    Redirect
} from 'react-router-dom'

interface Props {
    login
    setTime
}

const Login: React.FC<Props> = (props) => {
    const [email, setEmail] = useState<String>('')
    const [password, setPassword] = useState<String>('')
    const [toHome, setToHome] = useState(false)
    const [err, setErr] = useState(null)

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const response = await props.login({
                variables: { email, password },
            })
            props.setTime(response.data.login.tokenTime)
            let form = document.getElementById('login')
            if (form) (form as HTMLFormElement).reset();
            setToHome(true)
        } catch (error) {
            const array=error.message.split(':')
            setErr(array[1])
            setTimeout(() => {
            setErr(null)
            }, 5000);
        }

    }
   /*  if(props.login.error){
    return(<div>{props.login.error.graphQLErrors[0].message}</div>)
    } */
    return (
        <div>
            <h2>Log in</h2>
            <form id='login'>
                <span>{err}</span><br></br>
                <input placeholder='email' onChange={(event) => setEmail(event.target.value)}></input><br></br>
                <input type='password' placeholder='password' onChange={(event) => setPassword(event.target.value)}></input><br></br>
                <button onClick={handleLogin}>login</button><br></br>
            </form>
            <p></p>
            <a href='/createNew'>create new account</a>
            {toHome ? <Redirect to='/' /> : null}
        </div>
    )
}
export default Login