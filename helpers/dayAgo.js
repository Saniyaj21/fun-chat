export const formatTimeAgo= (timestamp)=> {
    const now = new Date(); // Current date and time
    const date = new Date(timestamp); // Convert the timestamp to a Date object
    const seconds = Math.floor((now - date) / 1000); // Difference in seconds

    // Calculate time differences
    const intervals = {
        year: Math.floor(seconds / 31536000),
        month: Math.floor(seconds / 2592000),
        day: Math.floor(seconds / 86400),
        hour: Math.floor(seconds / 3600),
        minute: Math.floor(seconds / 60),
    };

    // Determine the appropriate time ago format
    if (intervals.year > 1) return `${intervals.year} years ago`;
    if (intervals.year === 1) return `1 year ago`;
    if (intervals.month > 1) return `${intervals.month} months ago`;
    if (intervals.month === 1) return `1 month ago`;
    if (intervals.day > 1) return `${intervals.day} days ago`;
    if (intervals.day === 1) return `1 day ago`;
    if (intervals.hour > 1) return `${intervals.hour} hours ago`;
    if (intervals.hour === 1) return `1 hour ago`;
    if (intervals.minute > 1) return `${intervals.minute} minutes ago`;
    if (intervals.minute === 1) return `1 minute ago`;
    return `just now`;
}

