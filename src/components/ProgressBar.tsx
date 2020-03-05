import React from 'react'
import '../css/ProgressBar.css'

interface Props {
    load
}

const ProgressBar:React.FC<Props> = (props) => { 
    let load=props.load
    let cname=load?'rangeload':'range'
return (<div style={{visibility:load?'visible':'hidden'}} className='progressbar'>
    <div className={cname}></div>
</div>)
} 
export default ProgressBar