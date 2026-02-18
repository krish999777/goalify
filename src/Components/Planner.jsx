import {useState} from 'react'
import {Link} from 'react-router-dom'
export default function({data,setData}){
    const [showCompletedSubjects,setShowCompletedSubjects]=useState(false)
    const [showBacklogSubjects,setShowBacklogSubjects]=useState(false)
    let allSubjects=[]
    let doneSubjects=[]
    let backlogSubjects=[]
    const today = new Date().toISOString().split('T')[0]
    data.forEach(board=>{
        board.subjects.forEach(subject=>{
            allSubjects.push(subject)
            if(subject.status==='done'&&doneSubjects.length<5){
                doneSubjects.push(subject)
            }
            if((subject.status==='started'||subject.status==='pending')&&backlogSubjects.length<5){
                backlogSubjects.push(subject)
            }
        })
    })
    if(allSubjects.length===0){
        return (
            <div style={{display:'flex', flexDirection:'column' ,alignItems:'center'}}>
                <h1 style={{marginTop:'40px',marginBottom:'10px'}}>No Boards yet.</h1>
                <Link to="/"className="btn-primary">Go to Home</Link>
            </div>
        )
    }
    const priority={
        high:1,
        medium:2,
        low:3
    }

    backlogSubjects.sort((a,b)=>priority[a.priority]-priority[b.priority])

    const overDueSubjects=allSubjects.filter(sub=>sub.status!=='done'&&sub.dueDate!==''&&sub.dueDate<today)
    .slice(0,5).sort((a,b)=>priority[a.priority]-priority[b.priority])

    const dueTodaySubjects=allSubjects.filter(sub=>sub.status!=='done'&&sub.dueDate!==''&&sub.dueDate===today)
    .slice(0,5).sort((a,b)=>priority[a.priority]-priority[b.priority])

    const upcomingSubjects=allSubjects.filter(sub=>sub.status!=='done'&&sub.dueDate!==''&&sub.dueDate>today)
    .slice(0,5).sort((a,b)=>priority[a.priority]-priority[b.priority])

    const prioritySubjects=([...allSubjects].sort((a,b)=>priority[a.priority]-priority[b.priority]))
    .filter(sub=>sub.status!=='done'&&!sub.dueDate).slice(0,5)


    function setPriority(subjectId,priority,boardId){
        setData(prevData=>{
            return prevData.map(board=>{
                if(board.id===boardId){
                    return {
                        ...board,
                        subjects:board.subjects.map(sub=>{
                            if(sub.id===subjectId){
                                return {
                                    ...sub,
                                    priority
                                }
                            }
                            return sub
                        })
                }
                }
                return board
            })
        })
    }
    function setDueData(subjectId,dueDate,boardId){
        setData(prevData=>{
            return prevData.map(board=>{
                if(board.id===boardId){
                    return {
                        ...board,
                        subjects:board.subjects.map(sub=>{
                            if(sub.id===subjectId){
                                return {
                                    ...sub,
                                    dueDate:dueDate,
                                }
                            }
                            return sub
                        })
                }
                }
                return board
            })
        })
    }
    function statusChange(subjectId,status,boardId){
        setData(prevData=>{
            return prevData.map(board=>{
                if(board.id===boardId){
                    return {
                        ...board,
                        subjects:board.subjects.map(sub=>{
                            if(sub.id===subjectId){
                                return {
                                    ...sub,
                                    status:status,
                                }
                            }
                            return sub
                        })
                }
                }
                return board
            })
        })
    }


    return(
        <div>
            <div style={{margin:'20px 0',display:'flex',justifyContent:'center'}}>
                <Link to="/" className="btn-primary">Back to Home</Link>
                <Link to="/calendar" className="btn-primary">Go to Calendar</Link>
            </div>
            {overDueSubjects.length===0
            ?
            ''
            :
            (
                <div className="stats-planner-container">
                    <h1 className="title-stats-planner">Overdue Subjects</h1>
                    <div className="overdue-subjects status-subjects-planner">
                            {overDueSubjects.map(sub=>{
                                return(
                                    <div key={`${sub.id} ${sub.boardId}`} className={`each-subject-board ${sub.status}`}>
                                        <div className={`name ${sub.status}`}>
                                        <div>{sub.name}</div>
                                        <div>{sub.priority==='high'?'🔴':sub.priority==='medium'?'🟡':'🟢'}</div>
                                    </div>
                                    <div>
                                        <div style={{display:'flex',justifyContent:'center'}}>
                                            <div style={{margin:'0 20px'}}>Status</div>
                                            <div style={{margin:'0 20px'}}>Priority</div>
                                        </div>
                                        <select className="board-select" defaultValue={sub.status} onChange={(e)=>statusChange(sub.id,e.target.value,sub.boardId)} name='status'>
                                            <option value='pending'>Pending</option>
                                            <option value='started'>Started</option>
                                            <option value='done'>Done</option>
                                        </select>
                                        <select className="board-select" defaultValue={sub.priority} onChange={(e)=>setPriority(sub.id,e.target.value,sub.boardId)} name='status'>
                                            <option value='low'>Low</option>
                                            <option value='medium'>Medium</option>
                                            <option value='high'>High</option>
                                        </select>
                                    </div>
                                    <div style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
                                            <div>Due Date:</div>
                                            <input type="date" className="board-select" defaultValue={sub.dueDate} min={today}onChange={(e)=>setDueData(sub.id,e.target.value,sub.boardId)} name='due-date'/>
                                    </div>
                                        <Link to={`/boards/${sub.boardId}`}className="btn-secondary">Jump to Board</Link>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            )
            }
            {dueTodaySubjects.length===0
            ?
            ''
            :
            (
            <div className="stats-planner-container">
                <h1 className="title-stats-planner">Due Today</h1>
                <div className="due-today-subjects status-subjects-planner">
                    {dueTodaySubjects.map(sub=>{
                        return(
                            <div key={`${sub.id} ${sub.boardId}`} className={`each-subject-board ${sub.status}`}>
                                <div className={`name ${sub.status}`}>
                                <div>{sub.name}</div>
                                <div>{sub.priority==='high'?'🔴':sub.priority==='medium'?'🟡':'🟢'}</div>
                            </div>
                            <div>
                                <div style={{display:'flex',justifyContent:'center'}}>
                                    <div style={{margin:'0 20px'}}>Status</div>
                                    <div style={{margin:'0 20px'}}>Priority</div>
                                </div>
                                <select className="board-select" defaultValue={sub.status} onChange={(e)=>statusChange(sub.id,e.target.value,sub.boardId)} name='status'>
                                    <option value='pending'>Pending</option>
                                    <option value='started'>Started</option>
                                    <option value='done'>Done</option>
                                </select>
                                <select className="board-select" defaultValue={sub.priority} onChange={(e)=>setPriority(sub.id,e.target.value,sub.boardId)} name='status'>
                                    <option value='low'>Low</option>
                                    <option value='medium'>Medium</option>
                                    <option value='high'>High</option>
                                </select>
                            </div>
                            <div style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
                                    <div>Due Date:</div>
                                    <input type="date" className="board-select" defaultValue={sub.dueDate} min={today}onChange={(e)=>setDueData(sub.id,e.target.value,sub.boardId)} name='due-date'/>
                            </div>
                                <Link to={`/boards/${sub.boardId}`}className="btn-secondary">Jump to Board</Link>
                            </div>
                        )
                    })}
                </div>
            </div>
            )
            }
            {upcomingSubjects.length===0
            ?
            ''
            :
            (
            <div className="stats-planner-container">
                <h1 className="title-stats-planner">Upcoming Subjects</h1>
                <div className="upcoming-subjects status-subjects-planner">
                    {upcomingSubjects.map(sub=>{
                        return(
                            <div key={`${sub.id} ${sub.boardId}`} className={`each-subject-board ${sub.status}`}>
                                <div className={`name ${sub.status}`}>
                                <div>{sub.name}</div>
                                <div>{sub.priority==='high'?'🔴':sub.priority==='medium'?'🟡':'🟢'}</div>
                            </div>
                            <div>
                                <div style={{display:'flex',justifyContent:'center'}}>
                                    <div style={{margin:'0 20px'}}>Status</div>
                                    <div style={{margin:'0 20px'}}>Priority</div>
                                </div>
                                <select className="board-select" defaultValue={sub.status} onChange={(e)=>statusChange(sub.id,e.target.value,sub.boardId)} name='status'>
                                    <option value='pending'>Pending</option>
                                    <option value='started'>Started</option>
                                    <option value='done'>Done</option>
                                </select>
                                <select className="board-select" defaultValue={sub.priority} onChange={(e)=>setPriority(sub.id,e.target.value,sub.boardId)} name='status'>
                                    <option value='low'>Low</option>
                                    <option value='medium'>Medium</option>
                                    <option value='high'>High</option>
                                </select>
                            </div>
                            <div style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
                                    <div>Due Date:</div>
                                    <input type="date" className="board-select" defaultValue={sub.dueDate} min={today}onChange={(e)=>setDueData(sub.id,e.target.value,sub.boardId)} name='due-date'/>
                            </div>
                                <Link to={`/boards/${sub.boardId}`}className="btn-secondary">Jump to Board</Link>
                            </div>
                        )
                    })}
                </div>
            </div>
            )
            }
            {prioritySubjects.length===0
            ?
            ''
            :
            (
            <div className="stats-planner-container">
                <h1 className="title-stats-planner">Subjects with no due date</h1>
                <div className="priority-subjects status-subjects-planner">
                    {prioritySubjects.map(sub=>{
                        return(
                            <div key={`${sub.id} ${sub.boardId}`} className={`each-subject-board ${sub.status}`}>
                                <div className={`name ${sub.status}`}>
                                <div>{sub.name}</div>
                                <div>{sub.priority==='high'?'🔴':sub.priority==='medium'?'🟡':'🟢'}</div>
                            </div>
                            <div>
                                <div style={{display:'flex',justifyContent:'center'}}>
                                    <div style={{margin:'0 20px'}}>Status</div>
                                    <div style={{margin:'0 20px'}}>Priority</div>
                                </div>
                                <select className="board-select" defaultValue={sub.status} onChange={(e)=>statusChange(sub.id,e.target.value,sub.boardId)} name='status'>
                                    <option value='pending'>Pending</option>
                                    <option value='started'>Started</option>
                                    <option value='done'>Done</option>
                                </select>
                                <select className="board-select" defaultValue={sub.priority} onChange={(e)=>setPriority(sub.id,e.target.value,sub.boardId)} name='status'>
                                    <option value='low'>Low</option>
                                    <option value='medium'>Medium</option>
                                    <option value='high'>High</option>
                                </select>
                            </div>
                            <div style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
                                    <div>Due Date:</div>
                                    <input type="date" className="board-select" defaultValue={sub.dueDate} min={today}onChange={(e)=>setDueData(sub.id,e.target.value,sub.boardId)} name='due-date'/>
                            </div>
                                <Link to={`/boards/${sub.boardId}`}className="btn-secondary">Jump to Board</Link>
                            </div>
                        )
                    })}
                </div>
            </div>
            )
            }
            {backlogSubjects.length===0?''
            :
            <div style={{display:'flex',justifyContent:'center'}}>
                <button className="btn-primary" 
                onClick={()=>setShowBacklogSubjects(prev=>!prev)}>
                    {showBacklogSubjects?'Hide':'Show'} backlog subjects
                </button>
            </div>
            }
            {showBacklogSubjects
            ?
                <div className="stats-planner-container">
                    <h1 className="title-stats-planner">Backlog Subjects</h1>
                    <div className="backlog-subjects status-subjects-planner">
                        {backlogSubjects.map(sub=>{
                            return(
                                <div key={`${sub.id} ${sub.boardId}`} className={`each-subject-board ${sub.status}`}>
                                    <div className={`name ${sub.status}`}>
                                    <div>{sub.name}</div>
                                    <div>{sub.priority==='high'?'🔴':sub.priority==='medium'?'🟡':'🟢'}</div>
                                </div>
                                <div>
                                    <div style={{display:'flex',justifyContent:'center'}}>
                                        <div style={{margin:'0 20px'}}>Status</div>
                                        <div style={{margin:'0 20px'}}>Priority</div>
                                    </div>
                                    <select className="board-select" defaultValue={sub.status} onChange={(e)=>statusChange(sub.id,e.target.value,sub.boardId)} name='status'>
                                        <option value='pending'>Pending</option>
                                        <option value='started'>Started</option>
                                        <option value='done'>Done</option>
                                    </select>
                                    <select className="board-select" defaultValue={sub.priority} onChange={(e)=>setPriority(sub.id,e.target.value,sub.boardId)} name='status'>
                                        <option value='low'>Low</option>
                                        <option value='medium'>Medium</option>
                                        <option value='high'>High</option>
                                    </select>
                                </div>
                                <div style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
                                        <div>Due Date:</div>
                                        <input type="date" className="board-select" defaultValue={sub.dueDate} min={today}onChange={(e)=>setDueData(sub.id,e.target.value,sub.boardId)} name='due-date'/>
                                </div>
                                    <Link to={`/boards/${sub.boardId}`}className="btn-secondary">Jump to Board</Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            :
            ''
            }
            <br/>
            {doneSubjects.length===0?''
            :
            <div style={{display:'flex',justifyContent:'center', marginBottom:showCompletedSubjects?'0':'100px'}}>
                <button className="btn-primary"
                onClick={()=>setShowCompletedSubjects(prev=>!prev)}>
                    {showCompletedSubjects?'Hide':'Show'} completed subjects
                </button>
            </div>
            }
            {showCompletedSubjects
            ?
                <div className="stats-planner-container">
                    <h1 className="title-stats-planner">Completed Subjects</h1>
                    <div className="completed-subjects status-subjects-planner">
                        {doneSubjects.map(sub=>{
                            return(
                                <div key={`${sub.id} ${sub.boardId}`} className={`each-subject-board ${sub.status}`}>
                                    <div className={`name ${sub.status}`}>
                                    <div>{sub.name}</div>
                                    <div>{sub.priority==='high'?'🔴':sub.priority==='medium'?'🟡':'🟢'}</div>
                                </div>
                                <div>
                                    <div style={{display:'flex',justifyContent:'center'}}>
                                        <div style={{margin:'0 20px'}}>Status</div>
                                        <div style={{margin:'0 20px'}}>Priority</div>
                                    </div>
                                    <select className="board-select" defaultValue={sub.status} onChange={(e)=>statusChange(sub.id,e.target.value,sub.boardId)} name='status'>
                                        <option value='pending'>Pending</option>
                                        <option value='started'>Started</option>
                                        <option value='done'>Done</option>
                                    </select>
                                    <select className="board-select" defaultValue={sub.priority} onChange={(e)=>setPriority(sub.id,e.target.value,sub.boardId)} name='status'>
                                        <option value='low'>Low</option>
                                        <option value='medium'>Medium</option>
                                        <option value='high'>High</option>
                                    </select>
                                </div>
                                <div style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
                                        <div>Due Date:</div>
                                        <input type="date" className="board-select" defaultValue={sub.dueDate} min={today}onChange={(e)=>setDueData(sub.id,e.target.value,sub.boardId)} name='due-date'/>
                                </div>
                                    <Link to={`/boards/${sub.boardId}`}className="btn-secondary">Jump to Board</Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            :
            ''
            }
        </div>
    )
}
{/* <div key={`${started.id} ${started.boardId}`} className={`each-subject-board ${started.status}`}>
    <div className={`name ${started.status}`}>
    <div>{started.name}</div>
    <div>{started.priority==='high'?'🔴':started.priority==='medium'?'🟡':'🟢'}</div>
</div>
<div>
    <div style={{display:'flex',justifyContent:'center'}}>
        <div style={{margin:'0 20px'}}>Status</div>
        <div style={{margin:'0 20px'}}>Priority</div>
    </div>
    <select className="board-select" defaultValue={started.status} onChange={(e)=>statusChange(started.id,e.target.value,started.boardId)} name='status'>
        <option value='pending'>Pending</option>
        <option value='started'>Started</option>
        <option value='done'>Done</option>
    </select>
    <select className="board-select" defaultValue={started.priority} onChange={(e)=>setPriority(started.id,e.target.value,started.boardId)} name='status'>
        <option value='low'>Low</option>
        <option value='medium'>Medium</option>
        <option value='high'>High</option>
    </select>
</div>
<div style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
        <div>Due Date:</div>
        <input type="date" className="board-select" defaultValue={started.dueDate} min={today}onChange={(e)=>setDueData(started.id,e.target.value,started.boardId)} name='due-date'/>
</div>
    <Link to={`/boards/${started.boardId}`}className="btn-secondary">Jump to Board</Link>
</div> */}