import {NavLink} from 'react-router-dom'
export default function(){
    const activeStyle={
        fontWeight: 'bold',
        textDecoration: 'underline',
        color: '#161616'
    }

    return(
        <nav>
            <NavLink style={({isActive})=>isActive?activeStyle:{}} end to="/"><div className="logo">Goalify</div></NavLink>
            <NavLink style={({isActive})=>isActive?activeStyle:{}}to="/planner">Planner</NavLink>
            <NavLink style={({isActive})=>isActive?activeStyle:{}}to="/calendar">Calendar</NavLink>
            <NavLink style={({isActive})=>isActive?activeStyle:{}}to="/Backup">Backup</NavLink>
        </nav>
    )
}