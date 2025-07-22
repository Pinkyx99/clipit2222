
import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    colorClass?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, colorClass = 'bg-blue-500' }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;

    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
                className={`${colorClass} h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;