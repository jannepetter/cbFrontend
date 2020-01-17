import React, { createContext, useState } from "react"

export const TestiContext=createContext<any>(null)

export const TProvide=(props)=>{
    const[test,setTest]=useState([
    ])
    return(
        <TestiContext.Provider value={[test,setTest]}>
            {props.children}
        </TestiContext.Provider>
    )
}


