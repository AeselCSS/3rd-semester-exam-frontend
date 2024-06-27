const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return (new Intl.DateTimeFormat('da-DK', { dateStyle: 'medium' }).format(dateObj));
}

export default formatDate;