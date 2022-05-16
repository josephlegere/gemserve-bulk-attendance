import React, { forwardRef, useEffect, useState } from 'react';

import { AppBar, Button, CircularProgress, Chip, Dialog, Grid, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import AttendAddForm from './AttendAddForm';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AttendAddEntry() {

    const [attendRows, setAttendRows] = useState(30);
    const [attendance, setAttendance] = useState([]);
    const [toggleForm, setToggleForm] = useState(false);

    const attendColumns = [
        { type: 'number', field: 'employeeid', headerName: 'Emp ID' },
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

    const closeForm = () => {
        setToggleForm(false);
        setAttendance([]);
    }

    const submitForm = () => {
        closeForm();
    }

    const addToGrid = (elem) => {
        setAttendance([...attendance, elem]);
    }

    return (
        <>
            <Button onClick={() => setToggleForm(true)} variant="outlined">Add Attendance</Button>
            <Dialog
                fullScreen
                open={toggleForm}
                onClose={closeForm}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={closeForm}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Attendance Entry
                        </Typography>
                        <Button autoFocus color="inherit" onClick={submitForm}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <Grid container justifyContent="center" spacing={2} style={{ marginTop: 10, marginBottom: 10 }}>
                    <Grid item xs={10}>
                        <DataGrid
                            rows={attendance}
                            columns={attendColumns}
                            autoHeight
                            density="compact"
                            pageSize={attendRows}
                            onPageSizeChange={(newPageSize) => setAttendRows(newPageSize)}
                            rowsPerPageOptions={[5, 10, 30, 50, 100]}
                            checkboxSelection
                            pagination
                        />
                    </Grid>
                </Grid>
                <AttendAddForm submitAdd={addToGrid} />
            </Dialog>
        </>
    )
}
