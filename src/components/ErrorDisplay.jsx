import React from 'react';

const ErrorDisplay = ({ error }) => {
    return (
        <div className="text-center py-4">
            <h4 className="text-4xl font-bold text-red-500">{error}</h4>
        </div>
    );
};

export default ErrorDisplay;
