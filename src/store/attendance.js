import axios from 'axios';
import moment from 'moment';

const requiredHours = 8;

const format_attendance = (data) => {
    const _attendance = data.map(({ employee, date, timings_raw: timings }, id) => {

        // console.log('timings', timings);
        const timings_day = timings.filter(tm => tm.tags.includes('Morning')).map(tm => `${moment(tm.in, 'HH:mm:ss').format('h:mma')} - ${moment(tm.out, 'HH:mm:ss').format('h:mma')}`)
        const timings_noon = timings.filter(tm => tm.tags.includes('Afternoon')).map(tm => `${moment(tm.in, 'HH:mm:ss').format('h:mma')} - ${moment(tm.out, 'HH:mm:ss').format('h:mma')}`)
        const timings_ot = timings.reduce((accum, curr) => {
            let time = accum.time;
            const current_hrs = moment(curr.out, 'HH:mm:ss').diff(moment(curr.in, 'HH:mm:ss'), 'hours', true);
            const hrs = accum.hrs + current_hrs;
            if (hrs > requiredHours) {
                if (accum.time.length === 0) {
                    // console.log(current_hrs - (hrs - requiredHours));
                    // console.log(moment(curr.in, 'HH:mm:ss').add(hrs - requiredHours, 'h').format('h:mma'));
                    time.push(`${moment(curr.in, 'HH:mm:ss').add(current_hrs - (hrs - requiredHours), 'h').format('h:mma')} - ${moment(curr.out, 'HH:mm:ss').format('h:mma')}`);
                }
                else time.push(`${moment(curr.in, 'HH:mm:ss').format('h:mma')} - ${moment(curr.out, 'HH:mm:ss').format('h:mma')}`);
            }

            return { hrs, time }
        }, { hrs: 0, time: [] });

        const locations = timings.map(({ location }) => location).filter(e => e !== '').join(', ');

        return ({ id, employeeid: employee.employeeid, employee: employee.employeename, date, timings_day, timings_noon, timings_ot: timings_ot.time, hours_ot: timings_ot.hrs > requiredHours ? timings_ot.hrs - requiredHours : 0, locations, status: (timings_ot.hrs > requiredHours ? 'OT' : timings_ot.hrs < requiredHours ? 'INC' : 'REG') });
    })

    return _attendance;
}

export const get = async () => {
    let _attendance = localStorage.getItem('attendance');

    return _attendance ? format_attendance(JSON.parse(_attendance)) : [];
}

export const insert = async (props) => {
    const attendance = props;
    let _attendance = localStorage.getItem('attendance');

    if (_attendance) _attendance = JSON.parse(_attendance);

    localStorage.setItem('attendance', JSON.stringify([...(_attendance || []), ...attendance.map(({ created, date, employeeid, employee, timings_raw, timings_store }) => ({ created, date, employee: { employeeid, employeename: employee }, timings: timings_store, timings_raw }))]));

    return attendance.map(({ date, employeeid, employee, timings_day, timings_noon, timings_ot, hours_ot, locations, status }) => ({ id: Date.now(), date, employeeid, employee, timings_day, timings_noon, timings_ot, hours_ot, locations, status }));
}
