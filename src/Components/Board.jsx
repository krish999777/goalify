import {useParams} from 'react-router-dom'
export default function(){
    const params=useParams()
    const id=params.id
    return(
        <h1>This is board {id}</h1>
    )

}