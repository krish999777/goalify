import {} from 'react'
import {} from 'react-router-dom'
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend)
export default function({pending,done,started}){
    if(!((pending||done)||started)){
        return
    }
    const data = {
    labels: [
        'Pending',
        'Done',
        'Started'
    ],
    datasets: [{
        label: 'Progress',
        data: [pending, done, started],
        backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
    }]
    }
    return(
        <div className="chart-container">
             <Pie data={data}/>
        </div>
    )
}