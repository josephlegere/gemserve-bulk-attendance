import React, { useEffect, useState } from 'react'

import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';

const AttendItemSet = (props) => {

    const { attend, index, remove, updateList } = props;

    const updateTimeIn = (val) => {
        console.log(val.format('HH:mm:ss'));
        updateList(val.format('HH:mm:ss'), index, 'in');
    }

    const updateTimeOut = (val) => {
        updateList(val.format('HH:mm:ss'), index, 'out');
    }

    return (
        <div className="my-2">
            <div>
                <TimePicker
                    label="Time In"
                    value={moment(attend.in, 'hh:mm:ss')}
                    onChange={updateTimeIn}
                    renderInput={(params) => <TextField {...params} size="small" />}
                />
                <TimePicker
                    label="Time Out"
                    value={moment(attend.out, 'hh:mm:ss')}
                    onChange={updateTimeOut}
                    renderInput={(params) => <TextField {...params} size="small" />}
                />
                <Fab
                    color="error" size="small"
                    onClick={() => remove(index)}
                ><CloseIcon /></Fab>
            </div>
            <TextField
                id="outlined-name"
                className="my-2"
                label="Location"
                size="small"
                value={attend.location}
                onChange={(e) => updateList(e.target.value, index, 'location')}
            />
        </div>
    )
}

export default function AttendAddForm(props) {

    const { submitAdd } = props;

    const [toggleForm, setToggleForm] = useState(false);
    const [date, setDate] = useState(moment());
    const [name, setName] = useState('');
    const [timings, setTimings] = useState([
        { in: '05:30:00', out: '12:00:00', location: '', tags: ['Morning'] },
        { in: '16:00:00', out: '17:30:00', location: '', tags: ['Afternoon'] }
    ]);

    const requiredHours = 8;

    const closeForm = () => {
        setToggleForm(false);
        setDate(moment());
        setName('');
        setTimings([
            { in: '05:30:00', out: '12:00:00', location: '', tags: ['Morning'] },
            { in: '16:00:00', out: '17:30:00', location: '', tags: ['Afternoon'] }
        ]);
    }

    const submitForm = () => {
        console.log('timings', timings);
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
        console.log(timings_ot);

        const locations = timings.map(({ location }) => location).filter(e => e !== '').join(', ');

        if (submitAdd) submitAdd({
            employeeid: 1001,
            employee: name,
            date: date.format('YYYY-MM-DD'),
            timings_raw: timings,
            timings_day,
            timings_noon,
            timings_ot: timings_ot.time,
            hours_ot: timings_ot.hrs > requiredHours ? timings_ot.hrs - requiredHours : 0,
            locations,
            status: (timings_ot.hrs > requiredHours ? 'OT' : timings_ot.hrs < requiredHours ? 'INC' : 'REG'),
            entered: moment().format('YYYY-MM-DD')
        });

        closeForm();
    }

    const addTimeInSet = () => {
        let _timings = [...timings, { in: '12:00:00', out: '14:00:00', location: '', tags: ['Afternoon'] }];
        setTimings(identifyTags(_timings));
    }

    const removeTimeInSet = (index) => {
        let _timings = [...timings];
        _timings = _timings.filter((_item, _Index) => _Index !== index);
        setTimings(identifyTags(_timings));
    }

    const changeAttendDetails = (value, index, type) => {
        console.log(index);
        let _timings = [...timings];
        _timings[index][type] = value;
        setTimings(identifyTags(_timings));
    }
    
    const sortTiming = (timings) => {
        return timings.sort(function (a, b) {
            if (moment(a.in, 'HH:mm:ss').isBefore(moment(b.in, 'HH:mm:ss'))) return -1;
            if (moment(a.in, 'HH:mm:ss').isAfter(moment(b.in, 'HH:mm:ss'))) return 1;
            return 0;
        });
    }

    const identifyTags = (timings) => {
        let _hoursTotal = 0;
        timings = sortTiming(timings);
        return timings.map((timing) => {

            if (timing.out === '00:00:00') timing.out = '24:00:00';

            if (moment(timing.in, 'HH:mm:ss').isBefore(moment('12:00:00', 'HH:mm:ss'))) {
                timing.tags = timing.tags.filter((_item, _index) => _item !== 'Afternoon');
                if (!timing.tags.includes('Morning')) timing.tags = [...timing.tags, 'Morning'];
            }
            else {
                timing.tags = timing.tags.filter((_item, _index) => _item !== 'Morning');
                if (!timing.tags.includes('Afternoon')) timing.tags = [...timing.tags, 'Afternoon'];
            }

            if (_hoursTotal <= requiredHours) {
                timing.tags = timing.tags.filter((_item, _index) => _item !== 'Overtime');
                _hoursTotal += (moment(timing.out, 'HH:mm:ss').diff(moment(timing.in, 'HH:mm:ss'), 'hours', true));
            }
            if (_hoursTotal > requiredHours) {
                if (!timing.tags.includes('Overtime')) timing.tags = [...timing.tags, 'Overtime'];
            }

            return timing;
        });
    }

    return (
        <>
            <Fab color="primary" aria-label="add" onClick={() => setToggleForm(true)} style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <AddIcon />
            </Fab>
            <Dialog
                open={toggleForm}
                onClose={closeForm}
                aria-labelledby="alert-add-attend-title"
                aria-describedby="alert-add-attend-description"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="alert-add-attend-title">
                    Add Attendance
                </DialogTitle>
                <DialogContent style={{ paddingTop: '1rem', paddingBottom: '1rem' }} className="flex flex-col">
                    <DatePicker
                        label="Work Date"
                        value={date}
                        onChange={(newValue) => {
                            setDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} size="small" className="my-2" />}
                    />
                    <TextField
                        id="outlined-name"
                        className="my-2"
                        label="EmployeeName"
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="flex flex-row justify-between items-start mb-2">
                        <Typography
                            variant="body1"
                            noWrap
                            component="div"
                            className="mt-2"
                            // sx={{ mr: 2, mb: 2 }}
                        >
                            Timings
                        </Typography>
                        <Button onClick={addTimeInSet} variant="outlined">Add</Button>
                    </div>
                    {
                        timings.map((item, index) => <AttendItemSet attend={item} key={index} index={index} remove={removeTimeInSet} updateList={changeAttendDetails} />)
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeForm}>Cancel</Button>
                    <Button onClick={submitForm} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
