import {} from 'react'
import {Link} from 'react-router-dom'
import Pie from './PieChart'
export default function({toggleNewBoard,setData,data}){
    if(data.length===0){
        return(
            <div className="no-boards-container">
                <h1>No Boards yet. Create new Board?</h1>
                <button onClick={toggleNewBoard}>New Board</button>
            </div>
        )
    }
    const totalSubjects=data.reduce((acc,board)=>{
        return acc+board.subjects.length
    },0)
    const totalPending=data.reduce((acc,board)=>{
        return acc+board.subjects.reduce((acc,sub)=>{
            if(sub.status==='pending')
                return acc+1
            return 0
        },0)
    },0)
    const totalDone=data.reduce((acc,board)=>{
        return acc+board.subjects.reduce((acc,sub)=>{
            if(sub.status==='done')
                return acc+1
            return 0
        },0)
    },0)
    const totalStarted=data.reduce((acc,board)=>{
        return acc+board.subjects.reduce((acc,sub)=>{
            if(sub.status==='started')
                return acc+1
            return 0
        },0)
    },0)
    const inProgress=[]
    data.forEach(board=>{
        board.subjects.forEach(sub=>{
            if(inProgress.length<5&&sub.status==='started')
                inProgress.push(sub)
        })
    })
    const inProgressData=inProgress.map((sub,ind)=>{
        return (
            <div key={ind} className="each-subject-in-progress">
                {sub.name}
            </div>
        )
    })
    const displayBoards=data.map((board,index)=>{
        return(
            <Link key={index} to={`/boards/${board.id}`}>
                <div className="each-board">
                    <div className="title">{board.name}</div>
                    <div className="all-subjects">
                        {board.subjects.map((sub,index)=>{
                            return(
                                <div key={index} className="each-subject">
                                    {sub.name}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Link>
        )
    })
    return(
        <div className="homepage">
            <Link to="/planner">Planner</Link>
            <Link to="/calendar">Calender</Link>
            <button onClick={toggleNewBoard}>New Board</button>
            <button onClick={()=>{
                setData([])
            }}>Clear Local Storage</button>
            <div className="total-counts">
                <div className="total-boards-count">Total Boards={data.length}</div>
                <div className="total-subjects-count">Total Subjects={totalSubjects}</div>
                <div className="total-done-count">Total Done={totalDone}</div>
                <div className="total-started-count">Total Started={totalStarted}</div>
                <div className="total-pending-count">Total Pending={totalPending}</div>
            </div>
            <div>
                {displayBoards}
            </div>
            <Pie pending={totalPending} done={totalDone} started={totalStarted}/>
            <div className="in-progress-container">
                <div>Currently in progress:</div>
                <div className="in-progress-subjects">
                    {inProgressData}
                </div>
            </div>
        </div>
    )
}