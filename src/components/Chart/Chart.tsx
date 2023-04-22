import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const
    },
    title: {
      display: true,
      text: 'Biểu đồ'
    }
  }
}

const labels = ['Mon', 'Tue', 'Wed', 'Wed', 'Fri', 'Sat', 'Sun']

export const data = {
  labels,
  datasets: [
    {
      label: 'Doanh thu',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 7000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }
  ]
}

export function Chart() {
  return <Line options={options} data={data} />
}
