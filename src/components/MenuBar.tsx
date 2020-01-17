import React, { useRef, useEffect } from 'react'
import HamburgerButton from './HamburgerButton'
import '../css/MenuBar.css'
import { Link } from 'react-router-dom'




interface Props {
    toggleSideDrawer
    time
    logout
    me
}


const MenuBar: React.FC<Props> = (props) => {
    const renders = useRef(0)
    console.log(renders.current++, 'menubarrenders');

    useEffect(() => {
        let span = document.getElementById('span'); 
        let time: number = props.time
        const countdown = () => {
            time--
            if (time < 0) {
                clearInterval(myInterval)
                return
            }
            let mins: number = Math.floor(time / 60)
            let secs: number = time % 60
            if (span !== null) {
                span.textContent = `${mins}:${secs}`;
            }
        }
        let myInterval = setInterval(countdown, 1000)
        return () => clearInterval(myInterval)
    }, [props.time])

    const loggedin = {
        display: props.me.data.me ? '' : 'none'
    }
    const loggedout = {
        display: props.me.data.me ? 'none' : ''
    }
    const handleLogout = async (event) => {
        event.preventDefault()
        localStorage.clear()
        /* await client.resetStore() */ //muistutukseksi ettei tartte tätä, resetstore hakee kaikki queryt uusiksi
        await props.logout()            //logoutmutaatiolle on jo määritelty refechinä me ja myrecipes
                                        //ja sillai se on järkevintä pitää
    }
    return (
        <header className='menubar'>
            <nav className='menubar_navigation'>
                <HamburgerButton onClick={props.toggleSideDrawer} ></HamburgerButton>
                <Link className='menubar_logo' to="/">CB </Link>
                <div className='spacer'></div>
                <div className='menubar_navigation_items'>
                    <ul>
                        <li><input className='searchinput'></input><button>s</button></li>
                        <li className='menuSecondaryLinkItem' style={loggedin}><Link className='menuLinkItem' to="/myRecipes" /* onClick={()=>props.me.refetch() } */>myRecipes </Link></li>
                        <li className='menuSecondaryLinkItem' style={loggedin}><Link className='menuLinkItem' to="/createRecipe">createRecipe </Link></li>
                        <li style={loggedout}><Link className='menuLinkItem' to="/log">log</Link></li>
                        <li style={loggedin}><Link className='menuLinkItem' to="/myRecipes">{props.me.data.me?props.me.data.me.username:''}</Link>  <button onClick={handleLogout}>logout</button></li>
                        <span className='timer' style={loggedin} id='span'></span>
                    </ul>
                </div>
            </nav>
        </header>
    )
}
export default MenuBar