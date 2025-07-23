import React from 'react';

interface LineChartProps {
    data: number[];
    labels: string[];
    color?: string;
    height?: number;
    width?: number;
}

const formatLabel = (label: string) => {
    // Expects 'YYYY-MM-DD'
    const parts = label.split('-');
    if (parts.length === 3) {
        return `${parts[1]}/${parts[2]}`; // MM/DD
    }
    return label;
};

const LineChart: React.FC<LineChartProps> = ({
    data,
    labels,
    color = '#2563eb',
    height = 150,
    width = 300,
}) => {
    if (data.length === 0) {
        return <div style={{ height }} className="flex items-center justify-center text-sm text-gray-500">Not enough data to display chart.</div>;
    }

    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxX = chartWidth;
    const maxY = chartHeight;

    const maxDataValue = Math.max(...data, 1); // Avoid division by zero
    const minDataValue = Math.min(...data);

    // Function to create the SVG path data string
    const getPathData = () => {
        if (data.length < 2) {
            // Not enough points for a line, just show a point
            const x = padding;
            const y = height - padding - (data[0] / maxDataValue) * maxY;
            return `M ${x},${y} L ${x},${y}`;
        }

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * maxX + padding;
            const y = height - padding - ((value - minDataValue) / (maxDataValue - minDataValue)) * maxY;
            return `${x},${y}`;
        });

        return `M ${points[0]} L ${points.join(' L ')}`;
    };

    const pathData = getPathData();

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {/* Y-Axis labels */}
                <text x="5" y={padding} fontSize="10" fill="#9ca3af" textAnchor="start">{Math.round(maxDataValue).toLocaleString()}</text>
                <text x="5" y={height / 2} fontSize="10" fill="#9ca3af" textAnchor="start">{Math.round((maxDataValue + minDataValue) / 2).toLocaleString()}</text>
                
                {/* X-Axis labels */}
                {labels.map((label, index) => {
                    if (index % Math.ceil(labels.length / 5) !== 0 && index !== labels.length -1) return null; // Show ~5 labels
                     const x = (index / (labels.length - 1)) * maxX + padding;
                     return (
                         <text key={index} x={x} y={height - 5} fontSize="10" fill="#9ca3af" textAnchor="middle">
                             {formatLabel(label)}
                         </text>
                     );
                })}

                {/* Grid lines */}
                <line x1={padding} y1={padding} x2={width-padding} y2={padding} stroke="#4b5563" strokeWidth="0.5" strokeDasharray="2" />
                <line x1={padding} y1={height / 2} x2={width-padding} y2={height / 2} stroke="#4b5563" strokeWidth="0.5" strokeDasharray="2" />
                <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#4b5563" strokeWidth="0.5" />
                
                {/* Line chart path */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default LineChart;
