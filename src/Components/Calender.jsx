import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
export default function({data,setData}){
    const [currentYear,setCurrentYear]=useState(new Date().getFullYear())
    const [currentMonth,setCurrentMonth]=useState(new Date().getMonth())
    const [daySelected,setDaySelected]=useState(null)
    const navigate=useNavigate()
    const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate()
    const startDay=new Date(currentYear,currentMonth,1).getDay()
    const months=['January','February','March','April','May','June','July','August','September','October','November','December']
    const allSubjects=[]
    data.forEach(board=>{
        board.subjects.forEach(sub=>allSubjects.push(sub))
    })
    const allDates={}
    allSubjects.forEach(sub=>{
        if(sub.dueDate&&sub.status!=='done'){
            if(Object.hasOwn(allDates,sub.dueDate)){
                allDates[sub.dueDate].push(sub)
            }else{
                allDates[sub.dueDate]=[sub]
            }
        }
    })
    let monthCalender=[]
    for(let i=0;i<startDay;i++)
        monthCalender.push(null)
    for(let i=1;i<=daysInMonth;i++){
        monthCalender.push(i)
    }
    function setDayClicked(day,e){
        e.stopPropagation()
        setDaySelected(day)
    }
    const calender=monthCalender.map((day,index)=>{
        const thisDay=new Date(currentYear,currentMonth,day)
        const thisDayFormat=`${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
        const subjectsDueThisDay=allDates[thisDayFormat]
        const isSubjectDue=subjectsDueThisDay&&subjectsDueThisDay.length>0?true:false
        const today=new Date()
        const isSameDay=thisDay.getFullYear()===today.getFullYear()&&
        thisDay.getMonth()===today.getMonth()&&
        thisDay.getDate()===today.getDate()
        return(
            <div 
                key={index} 
                className={`calender-each-day ${isSubjectDue?'has-deadline':''} ${day===daySelected&&day!==null?'day-selected':''}`}
                onClick={(e)=>setDayClicked(day,e)}>
                <span className={isSameDay?'today':''}>{day?day:''}</span>
            </div>
        )
    })
    const daysOfWeek=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day,index)=>{
        return <div key={index} className="calender-each-day calender-day-names">{day}</div>
    })
    function prevMonth(){
        if(currentMonth===0){
            setCurrentMonth(11)
            setCurrentYear(prevYear=>prevYear-1)
            setDaySelected(null)
            return
        }
        setCurrentMonth(prevMonth=>prevMonth-1)
        setDaySelected(null)
    }
    function nextMonth(){
        if(currentMonth===11){
            setCurrentMonth(0)
            setCurrentYear(prevYear=>prevYear+1)
            setDaySelected(null)
            return
        }
        setCurrentMonth(prevMonth=>prevMonth+1)
        setDaySelected(null)
    }
    const tasksDisplayThisDay=()=>{
        if(!daySelected){
            return <div className="day-details">Selected a day</div>
        }
        const thisDay=`${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(daySelected).padStart(2,'0')}`
        const subjectsDueThisDay=allDates[thisDay]
        if(subjectsDueThisDay&&subjectsDueThisDay.length>0){
            return(
                <div className="day-details">
                    <div className="day-details-title">Selected Day: {`${months[currentMonth]} ${daySelected}, ${currentYear}`}</div>
                    <div className="task-list">
                        {subjectsDueThisDay.map((sub,index)=>{
                            return(
                                <div onClick={(e)=>{
                                        e.stopPropagation()
                                        navigate(`/boards/${sub.boardId}`)
                                    }}
                                    className="task-item"key={index}>   
                                    <div>{sub.name}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
        else{
            return(
                <div className="day-details empty-day">
                    <div className="day-details-title">Selected Day: {`${months[currentMonth]} ${daySelected}, ${currentYear}`}</div>
                    <div>No tasks due this day</div>
                </div>
            )
        }
    }
    return(
        <div style={{height:'100vh'}}className="full-calender-page" onClick={()=>setDaySelected(null)}>
            <div className="calender-current-month">
                <div><button className="btn-secondary" onClick={prevMonth}>{'<'}</button></div>
                <div>{months[currentMonth]} {currentYear}</div>
                <div><button className="btn-secondary" onClick={nextMonth}>{'>'}</button></div>
            </div>
            <div className="full-calender">
                {daysOfWeek}
                {calender}
            </div>
            <div className="tasks">
                {tasksDisplayThisDay()}
            </div>
        </div>
    )
}