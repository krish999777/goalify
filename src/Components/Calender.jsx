import {useState} from 'react'
import {} from 'react-router-dom'
export default function(){
    const [currentYear,setCurrentYear]=useState(new Date().getFullYear())
    const [currentMonth,setCurrentMonth]=useState(new Date().getMonth())
    const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate()
    const startDay=new Date(currentYear,currentMonth,1).getDay()
    const months=['January','February','March','April','May','June','July','August','September','October','November','December']
    let monthCalender=[]
    for(let i=0;i<startDay;i++)
        monthCalender.push(null)
    for(let i=1;i<=daysInMonth;i++){
        monthCalender.push(i)
    }
    const calender=monthCalender.map((day,index)=>{
        const thisDay=new Date(currentYear,currentMonth,day)
        const today=new Date()
        const isSameDay=thisDay.getFullYear()===today.getFullYear()&&
        thisDay.getMonth()===today.getMonth()&&
        thisDay.getDate()===today.getDate()
        return(
            <div key={index} className="calender-each-day">
                <span className={isSameDay?'today':''}>{day?day:''}</span>
            </div>
        )
    })
    const daysOfWeek=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day,index)=>{
        return <div key={index} className="calender-each-day">{day}</div>
    })
    function prevMonth(){
        if(currentMonth===0){
            setCurrentMonth(11)
            setCurrentYear(prevYear=>prevYear-1)
            return
        }
        setCurrentMonth(prevMonth=>prevMonth-1)
    }
    function nextMonth(){
        if(currentMonth===11){
            setCurrentMonth(0)
            setCurrentYear(prevYear=>prevYear+1)
            return
        }
        setCurrentMonth(prevMonth=>prevMonth+1)
    }
    return(
        <>
            <div className="calender-current-month">
                <div><button className="btn-secondary" onClick={prevMonth}>{'<'}</button></div>
                <div>{months[currentMonth]} {currentYear}</div>
                <div><button className="btn-secondary" onClick={nextMonth}>{'>'}</button></div>
            </div>
            <div className="full-calender">
                {daysOfWeek}
                {calender}
            </div>
        </>
    )
}