import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';
import User from './User'
import { USERS } from '../graphql/queries/USERS'
import { useLazyQuery } from "@apollo/react-hooks"


interface Props {
    me
    removeRecipe
}

const Apanel: React.FC<Props> = (props) => {
    const [getusers, users] = useLazyQuery(USERS)
    const [userfield, setUserfield] = useState('')
    console.log(userfield, 'yyseri fiieldi')
    if (!props.me.data || props.me.data.me === null) {
        return null
    }
    const name = props.me.data.me.username
    const role = props.me.data.me.role
    if (role !== 'admin') {
        return null
    }

    const tokenexpired = () => {
        localStorage.clear(); //koska me on null kun tämä suoritetaan niin poistaa muistista nämä
        return <Redirect to="/" />;
    };
    const handleGetUsers = () => {
        getusers({ variables: { name: userfield } })
    }
    return (<div>
        <h2>{`welcome ${name} ${role}`}</h2>
        <input onChange={(e) => setUserfield(e.target.value)}></input>
        <button onClick={handleGetUsers}>hae</button>
        {users.data && users.data.users.map(u =>
            <User
                key={u.username}
                removeRecipe={props.removeRecipe}
                user={u}
                me={props.me}
            ></User>)}
        {!props.me.data.me ? tokenexpired() : null}
    </div>)
}
export default Apanel