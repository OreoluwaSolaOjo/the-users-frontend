import React from 'react';

interface PercentageProps {
    numOfUsers: number;
    numOfProducts: number;
}

const PercentageCalculator: React.FC<PercentageProps> = ({ numOfUsers, numOfProducts }) => {
    const percentage = (numOfUsers / (numOfUsers + numOfProducts)) * 100;

    return (
        <div>
            <input 
                type="text" 
                value={`${percentage.toFixed(2)}%`} 
                readOnly
            />
        </div>
    );
}

export default PercentageCalculator;
