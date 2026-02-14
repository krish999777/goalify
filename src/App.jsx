import {useState,useEffect} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import Planner from './Components/Planner'
import Analysis from './Components/Analysis'
import Calender from './Components/Calender'
import Share from './Components/Share'
import Board from './Components/Board'

export default function(){
    // localStorage.clear()
    const [data,setData]=useState(()=>{
        const localData=localStorage.getItem('data')
        return localData?JSON.parse(localData):[]
    })
    useEffect(()=>{
        localStorage.setItem('data',JSON.stringify(data))
    },[data])
    return(
        <BrowserRouter>
            <Navbar/>
                <Routes>
                    <Route path="/" element={<Home data={data} setData={setData}/>}/>
                    <Route path="/planner" element={<Planner data={data} setData={setData}/>}/>
                    <Route path="/calendar" element={<Calender data={data} setData={setData}/>}/>
                    <Route path="/analysis" element={<Analysis data={data} setData={setData}/>}/>
                    <Route path="/share" element={<Share data={data} setData={setData}/>}/>
                    <Route path="/boards/:id" element={<Board data={data} setData={setData}/>}/>
                </Routes>
        </BrowserRouter>
    )
}