// src/components/ChartComponent.jsx
import React, { forwardRef } from 'react'; // <-- 1. Importamos 'forwardRef'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler);

// 2. Envolvemos todo el componente en 'forwardRef'.
// Esto nos da un segundo argumento, 'ref', que es la referencia que pasamos desde el padre.
const ChartComponent = forwardRef(({ type, data, options }, ref) => {

    // 3. Pasamos la 'ref' a cada componente de gráfico específico.
    switch (type) {
        case 'doughnut':
            return <Doughnut ref={ref} data={data} options={options} />;
        case 'bar':
            return <Bar ref={ref} data={data} options={options} />;
        case 'pie':
            return <Pie ref={ref} data={data} options={options} />;
        case 'line':
            return <Line ref={ref} data={data} options={options} />;
        default:
            return <div>Tipo de gráfico no válido</div>;
    }
});

export default ChartComponent;