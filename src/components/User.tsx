import React, { useState, useEffect } from 'react'
import {
    Link
} from 'react-router-dom'
import { useApolloClient } from '@apollo/react-hooks';
import { ME } from '../graphql/queries/me'
import '../css/User.css'



interface Props {
    user
    removeRecipe
    me
}



const User: React.FC<Props> = ({ user, me, removeRecipe }) => {
    const [showRecipes, setShowRecipes] = useState(false)
    const client = useApolloClient();
    const [userRecipes, setUserRecipes] = useState<any[]>([])

    useEffect(() => {
        setUserRecipes(user.userrecipes)
    }, [user])

    if (!me.data || me.data.me === null || undefined) {
        return null
    }
    /* const name = me.data.me.username */
    const role = me.data.me.role
    if (role !== 'admin') {
        return null
    }


    const handleShow = () => {
        return (
            <div>
                {userRecipes.map(r => <div key={r.id}>
                    <Link to={"/recipes/" + r.id}>
                        <li className='recipeline'>{r.title} </li>
                    </Link>
                    <button onClick={() => handleRemove(r.id)}>remove</button>

                </div>)}

            </div>
        )
    }
    const handleRemove = async (id) => {
        me.refetch();
        const currentUser = client.readQuery({ query: ME });
        console.log(currentUser.me.role, 'currentuser myrecipenpoistossa');
        if (currentUser.me.role === 'admin') {
            try {
                const removed = await removeRecipe({
                    variables: { id }
                });
                setUserRecipes(userRecipes.filter(r => r.id !== id))
                return removed
            } catch (error) {
                console.log(error, 'resipepoisto häslinkiä');
            }
        }
    };


    return (<div>
        <div onClick={() => setShowRecipes(!showRecipes)}>
            {user.username} {user.role}, recipes: {user.userrecipes.length}
        </div>
        {showRecipes && handleShow()}
    </div>)
}
export default User