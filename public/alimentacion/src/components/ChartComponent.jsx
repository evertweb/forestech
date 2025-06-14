// src/components/ChartComponent.jsx
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';

// Registramos todos los elementos que Chart.js necesita para los diferentes tipos de gráficos.
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler);

const ChartComponent = ({ type, data, options }) => {
    // Dependiendo del 'type' que le pasemos, renderizará un gráfico u otro.
    switch (type) {
        case 'doughnut':
            return <Doughnut data={data} options={options} />;
        case 'bar':
            return <Bar data={data} options={options} />;
        case 'pie':
            return <Pie data={data} options={options} />;
        case 'line':
            return <Line data={data} options={options} />;
        default:
            return <div>Tipo de gráfico no válido</div>;
    }
};

export default ChartComponent;