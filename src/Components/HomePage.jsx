import {} from 'react'
import {Link} from 'react-router-dom'
import Pie from './PieChart'
export default function({toggleNewBoard,setData,data}){
    if(data.length===0){
        return(
            <div className="no-boards-container">
                <h1>No Boards yet. Create new Board?</h1>
                <button className="new-board-btn" onClick={toggleNewBoard}>New Board</button>
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
            return acc
        },0)
    },0)
    const totalDone=data.reduce((acc,board)=>{
        return acc+board.subjects.reduce((acc,sub)=>{
            if(sub.status==='done')
                return acc+1
            return acc
        },0)
    },0)
    const totalStarted=data.reduce((acc,board)=>{
        return acc+board.subjects.reduce((acc,sub)=>{
            if(sub.status==='started')
                return acc+1
            return acc
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
                        {board.subjects.length>5?
                        board.subjects.map((sub,index)=>{
                            return(
                                index<=4?
                                <div key={index} className="each-subject">
                                    {sub.name}
                                </div>
                                :
                                ''
                            )
                        }):
                        board.subjects.map((sub,index)=>{
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
            <div className="homepage-buttons-container">
                <button className="new-board-btn" onClick={toggleNewBoard}>New Board</button>
                {/* <button  className="clear-local-btn" onClick={()=>setData([])}>Clear Local Storage</button> */}
                <Link className="homepage-navlinks btn-primary"to="/planner">Go To Planner</Link>
                <Link className="homepage-navlinks btn-primary"to="/calendar">Go To Calender</Link>
            </div>
            <div className="total-counts">
                <div className="total-boards-count">
                    <div className="title">Total Boards</div>
                    <div className="value">{data.length}</div>
                </div>
                <div className="total-subjects-count">
                    <div className="title">Total Subjects</div>
                    <div className="value">{totalSubjects}</div>
                </div>
                <div className="total-done-count">
                    <div className="title">Total Subjects Completed</div>
                    <div className="value">{totalDone}</div>
                </div>
                <div className="total-started-count">
                    <div className="title">Total Subjects Started</div>
                    <div className="value">{totalStarted}</div>
                </div>
                <div className="total-pending-count">
                    <div className="title">Total Subjects Pending</div>
                    <div className="value">{totalPending}</div>
                </div>
            </div>
            <div className="all-boards">
                {displayBoards}
            </div>
            {inProgress.length>0?<div className="in-progress-container">
                <div className="title">Currently in progress:</div>
                <div className="in-progress-subjects">
                    {inProgressData}
                </div>
            </div>:''}
            <div className="pie-chart">
                <Pie pending={totalPending} done={totalDone} started={totalStarted}/>
            </div>
        </div>
    )
}