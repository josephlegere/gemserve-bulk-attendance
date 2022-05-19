import React, { forwardRef, useEffect, useState } from 'react';

import { AppBar, Button, CircularProgress, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, Grid, IconButton, Slide, TextField, Toolbar, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import { useQuery } from 'react-query';

import { get as getAttendance } from '../store/attendance';
import AttendAddEntry from '../components/AttendAddEntry';

export default function Dashboard() {

    const { isLoading, error, data, refetch } = useQuery('getAttendance', getAttendance, {
        enabled: false
    });

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
        {
            field: 'timings_noon', headerName: 'Afternoon',
            minWidth: 170,
            renderCell: params => (
                <div className="flex flex-col">
                    {
                        params.row.timings_noon.map((elem, key) => <Chip label={elem} key={key} className="mb-1" />)
                    }
                </div>
            )
        },
        {
            field: 'timings_ot', headerName: 'OT Timings',
            minWidth: 170,
            renderCell: params => (
                <div className="flex flex-col">
                    {
                        params.row.timings_ot.map((elem, key) => <Chip label={elem} key={key} className="mb-1" />)
                    }
                </div>
            )
        },
        { type: 'number', field: 'hours_ot', headerName: 'OT Hours' },
        { field: 'locations', headerName: 'Locations' },
        { field: 'status', headerName: 'Status' },
    ];

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (data) {
            setAttendance(data);
        }

    }, [data]);

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
                        <div className="flex flex-row items-center">
                            <Button variant="contained" endIcon={<RefreshIcon />} onClick={() => refetch()} style={{ marginRight: 10 }}>
                                Refresh
                            </Button>
                            <AttendAddEntry />
                        </div>
                    </div>
                    <DataGrid
                        rows={attendance}
                        columns={attendColumns}
                        autoHeight
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        // density="compact"
                        pageSize={attendRows}
                        onPageSizeChange={(newPageSize) => setAttendRows(newPageSize)}
                        rowsPerPageOptions={[5, 10, 30, 50, 100]}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'date', sort: 'desc' }],
                            },
                        }}
                        // checkboxSelection
                        pagination
                    />
                </Grid>
            </Grid>
        </>
    )
}
