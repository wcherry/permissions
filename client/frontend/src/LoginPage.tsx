
import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import { AuthUser, BaseProps } from './schema';

interface LoginPageProps extends BaseProps {
    setUser: (authUser: AuthUser|null) => void;
    logout?: Boolean
}

const LoginPage : React.FC<LoginPageProps> = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };


    const [error, setError] = useState<string>('');

    const handleLogin = () => {
        axios.post('/api/login', { username, password })
            .then((response) => {
                // Handle successful login
                console.log(response.data);
                const authUser: AuthUser = response.data; // Fix: Assign response.data to authUser
                props.setUser(authUser); // Fix: Pass authUser to setUser
                })
            .catch((error) => {
                // Handle login error
                console.error(error);
                setError(`An error occurred during login. ${error}`);
            });
    };

    const handleLogout = () => {
        axios.get('/api/logout')
            .then((response) => {
                // Handle successful logout
                console.log(response.data);
                props.setUser(null);
                window.location.href = '/'; // Fix: Redirect to root URL
            })
            .catch((error) => {
                // Handle logout error
                console.error(error);
                setError(`An error occurred during logout. ${error}`);
            });
    };
    useEffect(() => {
        if(props.logout){
            // const nav = useNavigate();
            handleLogout();
            // nav('/');
        }
    }, [props.logout]);

    const handleCloseError = () => {
        setError('');
    };

    return (
        <div>
            <TextField
                label="Username"
                value={username}
                onChange={handleUsernameChange}
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
            {error && (
                    <div>
                        <p>{error}</p>
                        <button onClick={handleCloseError}>Close</button>
                    </div>
                )}
        </div>
    );
};

export default LoginPage;
