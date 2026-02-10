import {useState} from 'react'
import {} from 'react-router-dom'
import CreateBoard from './CreateBoard'
import HomePage from './HomePage'
export default function({data,setData}){
    const [isNewBoard,setIsNewBoard]=useState(false)
    // console.log(data)
    function toggleNewBoard(){
        setIsNewBoard(prevIsNewBoard=>!prevIsNewBoard)
    }
    
    
    return(
        isNewBoard?
        <CreateBoard setData={setData}toggleNewBoard={toggleNewBoard}/>
        :
        <HomePage toggleNewBoard={toggleNewBoard}setData={setData}data={data}/>
    )
}