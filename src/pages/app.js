import React from 'react';
import { Router } from "@reach/router";

import { Global } from '@emotion/react';

import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../pageapps/dashboard';
import Login from '../pageapps/login';

export default function App() {
    return (
        <>
            <Global
                styles={{
                    ".MuiDataGrid-root": { height: "auto !important", },
                    ".MuiDataGrid-root .MuiDataGrid-main": {
                        // paddingTop: 39,
                    },
                    ".MuiDataGrid-root .MuiDataGrid-viewport": { maxHeight: "none !important", },
                    ".MuiDataGrid-root .MuiDataGrid-window": {
                        position: "relative !important",
                        top: '0 !important'
                    },
                    ".MuiDataGrid-root .MuiDataGrid-windowContainer": { height: "auto !important", },
                    ".MuiDataGrid-root .MuiDataGrid-columnsContainer": {
                        position: 'relative !important'
                    },
                    ".MuiDataGrid-row, .MuiDataGrid-root .MuiDataGrid-cell, .rendering-zone, .MuiDataGrid-renderingZone": {
                        maxHeight: "none !important",
                    },
                    ".MuiDataGrid-root .MuiDataGrid-cell": {
                        textOverflow: 'inherit !important',
                        whiteSpace: 'break-spaces !important',
                        overflow: 'visible !important',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-all',
                        lineHeight: '20px !important'
                    },
                }}
            />
            <Router basepath="/app">
                <PrivateRoute path="/" component={Dashboard} />
                <Login path="/login" />
            </Router>
        </>
    )
}
