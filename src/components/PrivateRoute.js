import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import { Router } from "@reach/router";

// import app from "gatsby-plugin-firebase-v9.0";
// import { getAuth } from 'firebase/auth';
// import { useAuthState } from 'react-firebase-hooks/auth';

// const auth = getAuth(app);

const PrivateRoute = ({ component: Component, ...rest }) => {

    const { children } = rest;
    // const [user, loading, error] = useAuthState(auth);
    // const { dispatch } = store;
    // const [initializing, setInitializing] = useState(true);

    // useEffect(() => {
    //     console.log(user);
    //     console.log('loading', loading);
    //     if (!loading && !user) {
    //         navigate("/app/login");
    //     }
    // }, [user, loading]);

    // useEffect(async () => {
    //     const loggedUser = await dispatch.auth.isAuthenAsync();
    //     console.log(loggedUser);
    //     if (!loggedUser) {
    //         navigate("/app/login");
    //         return;
    //     }
    //     setInitializing(false);
    // }, [dispatch]);

    // if (!isLoggedIn() && location.pathname !== `/app/login`) {
    //     navigate("/app/login")
    //     return null
    // }

    // if (initializing) return <div>Loading</div>;

    return !children ? <Component {...rest} />
        : <Router>
            <Component {...rest} path="/" />
            {children.props.children}
        </Router>
}

export default PrivateRoute