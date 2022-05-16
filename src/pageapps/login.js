import React, { useState } from 'react';
import { navigate } from 'gatsby';

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');

    const login = () => {}

    return (
        <>
            <Box
                className="flex flex-col justify-center items-center"
                component="form"
                style={{ height: '100vh' }}
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <Typography
                    variant="caption"
                    component="div"
                    sx={{ display: { color: 'red' } }}
                >
                    {errors}
                </Typography>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ mr: 2 }}
                >
                    Gemserve Attendance - Login
                </Typography>
                <TextField
                    id="outlined-name"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    id="outlined-name"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                />
                <Button
                    onClick={() => login()}
                    variant="contained"
                    style={{
                        backgroundColor: '#1976d2'
                    }}
                    sx={{
                        my: 2,
                        display: 'block'
                    }}
                >
                    Login
                </Button>
            </Box>
        </>
    )
}
