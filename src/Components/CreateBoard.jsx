import {useState} from 'react'
import {} from 'react-router-dom'
export default function({handleSubmit,toggleNewBoard,setData}){
    const [newBoardSubjectCount,setNewBoardSubjectCount]=useState(1)
    let subjectInputSubjectsArray=[]
    for(let i=1;i<=newBoardSubjectCount;i++){
        subjectInputSubjectsArray.push(
            <div key={i}>
                <label htmlFor={`board-name-${i}`}>Subject {i} name</label>
                <input autoComplete="off" name={`board-name-${i}`} id={`board-name-${i}`} type="text" required={true}/>
            </div>
        )
    } 
    function boardSubjectCountSetter(event){
        const subjectCount=event.target.value
        setNewBoardSubjectCount(subjectCount)
    }  
    function handleSubmit(event){
        event.preventDefault()
        const form=event.target
        const formData=new FormData(form)
        const finalFormData=[...formData.values()]
        let flag=0
        finalFormData.forEach((input,i)=>{
            const trimmed=input.trim()
            if(trimmed.length===0)
                flag=1
            finalFormData[i]=trimmed
            if(trimmed.length>60)
                flag=1
            
        })
        if(flag===1){
            alert('Enter valid input')
            return
        }
        setData(prevData=>[...prevData,{
            id:prevData.length>0?prevData[prevData.length-1].id+1:1,
            name:finalFormData[0],
            subjects:([...finalFormData].slice(2)).map((sub,index)=>{
                return {
                    id:index,
                    name:sub,
                    status:'pending',
                }
            })
        }])
        toggleNewBoard()

    }
    return(
         <div className="new-board-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="board-name">Board name</label>
                    <input name="board-name"id="board-name" type="text"required={true} autoComplete="off" />
                </div>
                <div>
                    <label htmlFor="subjects-count">Number of Subjects</label>
                    <input autoComplete="off" name="subject-count" onChange={boardSubjectCountSetter} id="subjects-count"type="number" min="1" max="50"defaultValue="1" required={true} />
                </div>
                {subjectInputSubjectsArray}
                <button>Create Board</button>
            </form>
            <button onClick={toggleNewBoard}>Cancel</button>
        </div>
    )
}