import React, {useEffect} from "react";
import {Redirect} from "react-router-dom";

export const PrivateContent: React.FC = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <>
            {isAuthenticated ? children : <Redirect to={{ pathname: '/login' }}/>}
        </>
    );
}