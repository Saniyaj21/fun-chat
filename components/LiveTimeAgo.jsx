import { formatTimeAgo } from '@/helpers/dayAgo';
import React, { useEffect, useState } from 'react';

const LiveTimeAgo = ({ timestamp }) => {
    
    const [timeAgo, setTimeAgo] = useState(formatTimeAgo(timestamp));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(formatTimeAgo(timestamp));
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [timestamp]);

    return <span>{timeAgo}</span>;
};

export default LiveTimeAgo;