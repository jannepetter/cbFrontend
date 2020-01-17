import React from 'react'
import '../css/Backdrop.css'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    sideDrawerOpen
    toggleSideDrawer
}

const Backdrop:React.FC<Props> = (props) => {
    let cname = props.sideDrawerOpen ? 'backdrop open' : 'backdrop'
return (<div onClick={props.toggleSideDrawer} className={cname}></div>) 
}
export default Backdrop