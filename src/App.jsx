import {} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
export default function(){
    return(
        <BrowserRouter>
            <Navbar>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </Navbar>
        </BrowserRouter>
    )
}