export function capitalizeName(name) {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', options);
}

export function formatSalary(salary) {
    if (salary === null) {
        return 'N/A';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(salary);
}
