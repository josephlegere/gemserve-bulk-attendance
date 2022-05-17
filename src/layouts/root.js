import React from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

export default function RootLayout({ element }) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            {element}
        </LocalizationProvider>
    )
}
