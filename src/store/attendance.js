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

        const locations = timings.map(({ location }) => location).filter((e, pos, arr) => e !== '' && (!pos || e != arr[pos - 1])).join(', ');

        return ({ id, employeeid: employee.employeeid, employee: employee.employeename, date, timings_day, timings_noon, timings_ot: timings_ot.time, hours_ot: timings_ot.hrs > requiredHours ? timings_ot.hrs - requiredHours : 0, locations, status: (timings_ot.hrs > requiredHours ? 'OT' : timings_ot.hrs < requiredHours ? 'INC' : 'REG') });
    })

    return _attendance;
}

export const get = async () => {
    // localStorage is just for reference to compare data between local and server
    let _attendance = localStorage.getItem('attendance');
    localStorage.setItem('attendance', JSON.stringify(JSON.parse(_attendance).filter(({ created }) => moment(created).isAfter(moment().subtract(4, 'd')))));

    const { data } = await axios.post(process.env.ATTENDANCE_GET, {
        dskEntry: 1,
        st: 'logged in',
        dt: "today"
    });

    console.log(data);
    const _formatted = format_attendance(
    Object.values(
        data.attendance_list.filter(e => e !== 'manual').reduce((accum, curr) => {
            (accum[`${curr.attendempcode}_${curr.attenddate}`] = accum[`${curr.attendempcode}_${curr.attenddate}`] || []).push(curr);
            return accum;
        }, {})
    )
    .map((elem) => {
        const { attendempcode, attenddate, attendemployee, attendstatus } = elem[0];

        return ({ employee: { employeeid: attendempcode, employeename: attendemployee }, date: moment(attenddate, 'YYYY-MM-DD HH:mm:ss.SS').format('YYYY-MM-DD'), timings_raw: elem.map(({ attendin, attendout, attendplace }) => ({ in: attendin, out: attendout, location: attendplace, tags: [moment(attendin, 'HH:mm:ss.SS').isBefore(moment('12:00:00', 'HH:mm:ss')) ? 'Morning' : 'Afternoon'] })) });
    }));

    console.log(_formatted);

    return _formatted;
}

export const insert = async (props) => {
    const attendance = props;

    // console.log(attendance.reduce((accum, { employeeid, date, timings_raw }) => [...accum, ...timings_raw.map((({ in: in_time, out, location }) => ({ empcode: employeeid, date, in: in_time, out, place: location })))], []));

    const { data } = await axios.post(process.env.ATTENDANCE_INS, {
        dskEntry: 1,
        attendance: attendance.reduce((accum, { employeeid, date, timings_raw }) => [...accum, ...timings_raw.map((({ in: in_time, out, location }) => ({ empcode: employeeid, date, in: in_time, out, place: location })))], [])
    });

    console.log(data);

    let _attendance = localStorage.getItem('attendance');

    if (_attendance) _attendance = JSON.parse(_attendance);

    localStorage.setItem('attendance', JSON.stringify([...(_attendance || []), ...attendance.map(({ created, date, employeeid, employee, timings_raw, timings_store }) => ({ created, date, employee: { employeeid, employeename: employee }, timings: timings_store, timings_raw }))].filter(({ created }) => moment(created).isAfter(moment().subtract(4, 'd')))));

    return attendance.map(({ date, employeeid, employee, timings_day, timings_noon, timings_ot, hours_ot, locations, status }, key) => ({ id: `${Date.now()}_${key}`, date, employeeid, employee, timings_day, timings_noon, timings_ot, hours_ot, locations, status }));
}
