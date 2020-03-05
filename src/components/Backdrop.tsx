import React from 'react'
import '../css/Backdrop.css'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    sideDrawerOpen
    toggleSideDrawer
}

const Backdrop:React.FC<Props> = ({sideDrawerOpen,toggleSideDrawer}) => {
    let cname = sideDrawerOpen ? 'backdrop open' : 'backdrop'
return (<div onClick={toggleSideDrawer} className={cname}></div>) 
}
export default Backdrop