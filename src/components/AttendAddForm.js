import React, { useEffect, useState } from 'react'

import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function AttendAddForm(props) {

    const { submitAdd } = props;

    const [toggleForm, setToggleForm] = useState(false);
    const [name, setName] = useState('');

    const closeForm = () => {
        setToggleForm(false);
        setName('');
    }

    const submitForm = () => {
        if (submitAdd) submitAdd({ id: 1, employeeid: 1001, employee: 'Joseph Legere', date: '2022-05-15', timings_day: ['5:30am - 12:00pm'], timings_noon: ['4:30pm - 5:30pm'], timings_ot: [], hours_ot: 0, locations: '', status: 'REG', entered: '2022-05-16' });
        closeForm();
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
                <DialogContent className="flex flex-col py-2">
                    <TextField
                        id="outlined-name"
                        className="mb-2"
                        label="EmployeeName"
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
