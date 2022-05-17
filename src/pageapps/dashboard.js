import React, { forwardRef, useEffect, useState } from 'react';

import { AppBar, Button, CircularProgress, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, Grid, IconButton, Slide, TextField, Toolbar, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import AttendAddEntry from '../components/AttendAddEntry';

export default function Dashboard() {

    const [attendRows, setAttendRows] = useState(30);
    const [attendance, setAttendance] = useState([]);

    const attendColumns = [
        { field: 'employeeid', headerName: 'Emp ID' },
        { field: 'employee', headerName: 'Employee', minWidth: 170 },
        { type: 'date', field: 'date', headerName: 'Date' },
        {
            field: 'timingsDay', headerName: 'Morning',
            minWidth: 170,
            renderCell: params => (
                <div className="flex flex-col">
                    {
                        params.row.timings_day.map((elem, key) => <Chip label={elem} key={key} className="mb-1" />)
                    }
                </div>
            )
        },
        { field: 'timings_noon', headerName: 'Afternoon', minWidth: 170 },
        { field: 'timings_ot', headerName: 'Overtime', minWidth: 170 },
        { type: 'number', field: 'hours_ot', headerName: 'OT Hours' },
        { field: 'locations', headerName: 'Locations' },
        { field: 'status', headerName: 'Status' },
    ];

    useEffect(() => {
        setAttendance([
            // { id: 1, employee: 'Joseph Legere', date: '2022-05-15', AM_in: '05:30:00', AM_out: '12:00:00', PM_in: '16:00:00', PM_out: '17:30:00', OT_in: '', OT_out: '', OT_hours: 0, locations: '', status: 0 },
            { id: 1, employeeid: 1001, employee: 'Joseph Legere', date: '2022-05-15', timings_day: ['5:30am - 12:00pm', '5:30am - 12:00pm'], timings_noon: ['4:30pm - 5:30pm'], timings_ot: [], hours_ot: 0, locations: '', status: 'REG', entered: '2022-05-16' },
            { id: 2, employeeid: 1001, employee: 'Joseph Legere', date: '2022-05-15', timings_day: ['5:30am - 12:00pm'], timings_noon: ['4:30pm - 5:30pm'], timings_ot: [], hours_ot: 0, locations: '', status: 'REG', entered: '2022-05-16' },
        ]);
    }, []);

    return (
        <>
            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 10, marginBottom: 10 }}>
                <Grid item xs={10}>
                    <div className="flex flex-row justify-between items-center mb-2">
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            // sx={{ mr: 2, mb: 2 }}
                        >
                            Gemserve Bulk Attendance
                        </Typography>
                        <AttendAddEntry />
                    </div>
                    <DataGrid
                        rows={attendance}
                        columns={attendColumns}
                        autoHeight
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        density="compact"
                        pageSize={attendRows}
                        onPageSizeChange={(newPageSize) => setAttendRows(newPageSize)}
                        rowsPerPageOptions={[5, 10, 30, 50, 100]}
                        checkboxSelection
                        pagination
                    />
                </Grid>
            </Grid>
        </>
    )
}
