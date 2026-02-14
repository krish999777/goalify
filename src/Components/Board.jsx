import {useParams,Link,useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
export default function({data,setData}){
    const [isAddBoard,setAddBoard]=useState(false)
    const [editing,setEditing]=useState(null)
    const [filter,setFilter]=useState(null)
    const params=useParams()
    const id=Number(params.id)
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
    :
    {...boardUnfiltered}
    // useEffect(()=>{
    //     setAddBoard(prevData=>!prevData)
    // },[board])
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
                            status:'pending'}]}
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
                <form onSubmit={addSubject}>
                    <label htmlFor="subject-name">Subject name</label>
                    <input autoComplete="off" name="subject-name" id="subject-name" type="text" required={true}/>
                    <button>Add Subject</button>
                    <button type="button" onClick={toggleIsAddBoard}>Cancel</button>
                </form>
            </>
        )
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
                                    id:sub.id,
                                    name:sub.name,
                                    status:status
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
                                    id:sub.id,
                                    name:edit,
                                    status:sub.status
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
        <button className="add-subject" onClick={toggleIsAddBoard}>Add subject</button>
        <Link to="/">Back to Home</Link>
        <div className="each-board-details">
            {totalSubjects===totalDone?
            <div>All subjects completed</div>:''}
            <div className="board name">{board.name}</div>
            <button onClick={()=>setFilter('name')}>Filter by Name</button>
            <button onClick={()=>setFilter('status')}>Filter by Status</button>
            <div className="total-subjects">
                <div className="title">Total Subjects</div>
                <div className="value">{totalSubjects}</div>
            </div>
            <div className="progress">
                <div className="title">Progress</div>
                <div className="value">{progress}%</div>
            </div>
            <div className="subjects">
                {board.subjects.map((sub,ind)=>{
                    return(
                        <div key={sub.id} className="each-subject">
                            {editing===sub.id?
                            <div>
                                <form className="subject-edit" onSubmit={onEdit}>
                                    <input autoComplete='off' name='edit' type='text' defaultValue={sub.name}/>
                                    <button type='button' onClick={()=>setEditing(null)}>Cancel</button>
                                    <button>Save</button>
                                </form>
                            </div>
                            :
                            <><div style={{backgroundColor:sub.status==='pending'?'#6B7280':sub.status==='started'?'#F59E0B':'#10B981',width:'20px',height:'20px'}}/><div className="name">{sub.name}</div>
                            <select defaultValue={sub.status} onChange={(e)=>statusChange(sub.id,e.target.value)} name='status'>
                                <option value='pending'>Pending</option>
                                <option value='started'>Started</option>
                                <option value='done'>Done</option>
                            </select>
                            <button onClick={()=>setEdit(sub.id)}>Edit</button>
                            <button onClick={()=>deleteSubject(sub.id)}>Delete</button></>}
                        </div>
                    )
                })}
            </div>
            <button onClick={deleteBoard}>Delete Board</button>
        </div>
        </>
    )

}