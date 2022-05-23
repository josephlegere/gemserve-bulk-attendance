import React from 'react';

import { AppBar, Box, Button, Container, IconButton, InputLabel, Menu, MenuItem, OutlinedInput, Select, Toolbar, Typography } from '@mui/material';

export default function DefaultLayout(props) {
    const { children, isStandalone } = props;

    return (
        <>
            {
                isStandalone ?
                    <AppBar position="static">
                        <Container maxWidth="xl">
                            <Toolbar disableGutters>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                                >
                                    Gemserve Bulk Attendance
                                </Typography>

                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                                >
                                    Gemserve Bulk Attendance
                                </Typography>
                            </Toolbar>
                        </Container>
                    </AppBar>
                : ''
            }
            {children}
        </>
    )
}
