import React from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const queryClient = new QueryClient()

export default function RootLayout({ element }) {
    return (
        <QueryClientProvider client={queryClient}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                {element}
            </LocalizationProvider>
        </QueryClientProvider>
    )
}
