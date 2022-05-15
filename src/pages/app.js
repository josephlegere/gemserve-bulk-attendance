import React from 'react';
import { Router } from "@reach/router";

import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../pageapps/dashboard';
import Login from '../pageapps/login';

export default function App() {
    return (
        <Router basepath="/app">
            <PrivateRoute path="/" component={Dashboard} />
            <Login path="/login" />
        </Router>
    )
}
