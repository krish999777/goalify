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
        'Started',
        'Done'
    ],
    datasets: [{
        label: 'Progress',
        data: [pending, started, done],
        backgroundColor: [
        '#6B7280',
        '#F59E0B',
        '#10B981'
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