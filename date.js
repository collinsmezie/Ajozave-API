function dayOfTheWeek(){

    const today = new Date();

    const dayOfWeek = today.getDay();

    const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
    ];

    return daysOfWeek[dayOfWeek];
}

module.exports = dayOfTheWeek
