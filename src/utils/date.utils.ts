export const formatDateAndTime = (date: Date | string): string => {
    console.log("Formatting date and time:", date);
    return new Date(date).toLocaleString('en-AU', {
        timeZone: 'Australia/Melbourne',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

export const formatDate = (date: Date | string): string => {
    console.log("Formatting date:", date);
    return new Date(date).toLocaleString('en-AU', {
        timeZone: 'Australia/Melbourne',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}