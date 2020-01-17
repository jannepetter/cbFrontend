import React from 'react'
import '../css/HamburgerButton.css'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

const HamburgerButton:React.FC<Props> = (props) => {
return (
    <button {...props}  className='toggle-button'>      {/* propsit jotta saa napin ominaisuudet */}
        <div className='toggle-button-line'></div>
        <div className='toggle-button-line'></div>
        <div className='toggle-button-line'></div>
    </button>
)
}
export default HamburgerButton

