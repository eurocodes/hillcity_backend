exports.generateDateTime = () => {
    const today = new Date();
    const date = today.toDateString();;
    const dateTime = `${date}`;
    return dateTime;
}