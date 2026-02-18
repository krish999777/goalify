import {useParams,Link,useNavigate} from 'react-router-dom'
import {useState} from 'react'
export default function({data,setData}){
    const [isAddBoard,setAddBoard]=useState(false)
    const [editing,setEditing]=useState(null)
    const [filter,setFilter]=useState(null)
    const params=useParams()
    const id=Number(params.id)
    const today = new Date().toISOString().split('T')[0]
    const navigate=useNavigate()
    if(!data.some(board=>board.id===id)){
        return(
            <h1>Board Not Found</h1>
        )
    }
    const boardUnfiltered=data.filter(currentBoard=>{
        if(currentBoard.id===id){
            return true
        }
        return false
    })[0]
    const board=filter==='name'?
    {
        ...boardUnfiltered,
        subjects:[...boardUnfiltered.subjects].sort((a,b)=>a.name.localeCompare(b.name))
    }
    :filter==='status'?
    {
        ...boardUnfiltered,
        subjects:[...boardUnfiltered.subjects].sort((a,b)=>{
            if(a.status==='pending'&&b.status!=='pending'){
                return -1
            }
            else if(b.status==='pending'&&a.status!=='pending'){
                return 1
            }
            else if(a.status==='started'&&b.status!=='started'){
                return -1
            }
            else if(b.status==='started'&&a.status!=='started'){
                return 1
            }
            else if(a.status==='done'&&b.status!=='done'){
                return -1
            }
            else if(b.status==='done'&&a.status!=='done'){
                return 1
            }
            else{
                return 0
            }
        })
    }
    :filter==='priority'?
    {...boardUnfiltered,
        subjects:[...boardUnfiltered.subjects].sort((a,b)=>{
            if(a.priority==='high'&&b.priority!=='high'){
                return -1
            }
            else if(b.priority==='high'&&a.priority!=='high'){
                return 1
            }
            else if(a.priority==='medium'&&b.priority!=='medium'){
                return -1
            }
            else if(b.priority==='medium'&&a.priority!=='medium'){
                return 1
            }
            else if(a.priority==='low'&&b.priority!=='low'){
                return -1
            }
            else if(b.priority==='low'&&a.priority!=='low'){
                return 1
            }
            else{
                return 0
            }
        })
    }
    :filter==='dueDate'?
    {...boardUnfiltered,
        subjects:[...boardUnfiltered.subjects].sort((a,b)=>{
            if(!a.dueDate){
                return 1
            }
            if(!b.dueDate){
                return -1
            }
            const dateA=new Date(a.dueDate)
            const dateB=new Date(b.dueDate)
            return dateA-dateB
        })
    }
    :
    {...boardUnfiltered}

    const totalSubjects=board.subjects.length
    const totalPending=board.subjects.reduce((acc,sub)=>{
        if(sub.status==='pending'){
            return acc+1
        }
        return acc
    },0)
    const totalStarted=board.subjects.reduce((acc,sub)=>{
        if(sub.status==='started'){
            return acc+1
        }
        return acc
    },0)
    const totalDone=board.subjects.reduce((acc,sub)=>{
        if(sub.status==='done'){
            return acc+1
        }
        return acc
    },0)
    function addSubject(event){
        event.preventDefault()
        const form=event.target
        const formData=new FormData(form)
        const subject=formData.get('subject-name').trim()
        if(subject.length===0||subject.length>60){
            alert('Enter valid input')
            return
        }
        setData(prevData=>{
            return prevData.map(board=>{
                if(board.id===id){
                    return {...board ,
                            subjects:[...board.subjects,{
                            id:board.subjects.length > 0
                                ? Math.max(...board.subjects.map(s => s.id)) + 1
                                : 1,
                            name:subject,
                            status:'pending',
                            boardId:id,
                            priority:'medium',
                            dueData:null
                        }]}
                }
                return board
            })
        })
        toggleIsAddBoard()
    }
    function toggleIsAddBoard(){
        setAddBoard(prevIsAddBoard=>!prevIsAddBoard)
    }
    function deleteSubject(delId){
        if(board.subjects.length===1){
            alert('Only one subject left cannot delete')
            return
        }
        setData(prevData=>{
            return prevData.map(board=>{
                if(board.id===id){
                    return {
                        ...board,
                        subjects:board.subjects.filter(sub=>{
                            if(sub.id===delId)
                                return false
                            return true
                        })
                }
                }
                return board
            })
        })
    }
    function setEdit(editId){
        setEditing(editId)
    }
    const progress=((totalDone/totalSubjects)*100).toFixed(2)
    if(isAddBoard){
        return(
            <>
            <div className="add-subject-container">
                <form className="add-subject-form" onSubmit={addSubject}>
                    <label htmlFor="subject-name">Subject name</label>
                    <input autoComplete="off" name="subject-name" id="subject-name" type="text" required={true}/>
                    <div className="button-row">
                        <button className="submit-subjects-btn">Add Subject</button>
                        <button className="cancel-subject-btn"type="button" onClick={toggleIsAddBoard}>Cancel</button>
                    </div>
                </form>
            </div>
            </>
        )
    }
    function setPriority(subjectId,priority){
        setData(prevData=>{
            return prevData.map(board=>{
                if(board.id===id){
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
    function setDueData(subjectId,dueDate){
        setData(prevData=>{
            return prevData.map(board=>{
                if(board.id===id){
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
    function statusChange(subjectId,status){
        setData(prevData=>{
            return prevData.map(board=>{
                if(board.id===id){
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
    function onEdit(event){
        event.preventDefault()
        const form=event.target
        const formData=new FormData(form)
        const edit=formData.get('edit').trim()
        if(edit.length===0||edit.length>60){
            alert('Enter valid input')
            return
        }
        setData(prevData=>{
            return prevData.map(board=>{
                if(board.id===id){
                    return {
                        ...board,
                        subjects:board.subjects.map(sub=>{
                            if(sub.id===editing){
                                return {
                                    ...sub,
                                    name:edit
                                }
                            }
                            return sub
                        })
                }
                }
                return board
            })
        })
        setEditing(null)
    }
    function deleteBoard(){
        if(confirm('Are you sure you want to delete')){
            setData(prevData=>{
                return prevData.filter(board=>{
                    if(board.id===id){
                        return false
                    }
                    return true
                })
            })
            navigate('/')

        }
        else{
            return
        }
    }
    return(
        <>
        <div className="each-board-details">
            <div className="board-name">{board.name}</div>
            <div className='btn-container-board'>
                <Link className="home-link" to="/">Back to Home</Link>
                <button className="add-subject btn-primary" onClick={toggleIsAddBoard}>Add subject</button>
            </div>
            <div className="filter-container-board">
                <button className="btn-primary" onClick={()=>setFilter('name')}>Sort by Name</button>
                <button className="btn-primary" onClick={()=>setFilter('status')}>Sort by Status</button>
                <button className="btn-primary" onClick={()=>setFilter('priority')}>Sort by Priority</button>
                <button className="btn-primary" onClick={()=>setFilter('dueDate')}>Sort by Due Date</button>
            </div>
            <div className="all-stats-board">
                <div className="total-subjects">
                    <div className="title">Total Subjects</div>
                    <div className="value">{totalSubjects}</div>
                </div>
                <div className="progress">
                    <div className="title">Progress</div>
                    <div className="value">{progress}%</div>
                </div>
            </div>
            {totalSubjects===totalDone?
            <div className="all-subjects-completed">All subjects completed</div>:''}
            <div className="subjects">
                {board.subjects.map(sub=>{
                    return(
                        <div key={sub.id} className={`each-subject-board ${sub.status}`}>
                            {editing===sub.id?
                            <div>
                                <form className="subject-edit" onSubmit={onEdit}>
                                    <input autoComplete='off' name='edit' type='text' defaultValue={sub.name}/>
                                    <div>
                                        <button className="btn-primary">Save</button>
                                        <button className="btn-secondary" type='button' onClick={()=>setEditing(null)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                            :
                            <>
                            <div className={`name ${sub.status}`}>
                                <div>{sub.name}</div>
                                <div>{sub.priority==='high'?'🔴':sub.priority==='medium'?'🟡':'🟢'}</div>
                            </div>
                            <div>
                                <div style={{display:'flex',justifyContent:'center'}}>
                                    <div style={{margin:'0 20px'}}>Status</div>
                                    <div style={{margin:'0 20px'}}>Priority</div>
                                </div>
                                <select className="board-select" defaultValue={sub.status} onChange={(e)=>statusChange(sub.id,e.target.value)} name='status'>
                                    <option value='pending'>Pending</option>
                                    <option value='started'>Started</option>
                                    <option value='done'>Done</option>
                                </select>
                                <select className="board-select" defaultValue={sub.priority} onChange={(e)=>setPriority(sub.id,e.target.value)} name='priority'>
                                    <option value='low'>Low</option>
                                    <option value='medium'>Medium</option>
                                    <option value='high'>High</option>
                                </select>
                            </div>
                            Due Date:<input type="date" className="board-select" defaultValue={sub.dueDate}  onChange={(e)=>setDueData(sub.id,e.target.value)} name='due-date'/>
                            <div>
                                <button className="btn-secondary" onClick={()=>setEdit(sub.id)}>Edit</button>
                                <button className="btn-secondary del" onClick={()=>deleteSubject(sub.id)}>Delete</button>
                            </div>
                            </>
                            }
                        </div>
                    )
                })}
            </div>
            <button className="btn-primary delete-btn" onClick={deleteBoard}>Delete Board</button>
        </div>
        </>
    )

}