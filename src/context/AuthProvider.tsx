import React, {useCallback, useEffect, useState} from "react";
import {loginApi} from "../api/auth";
import {tokenStorage} from "../storage/credentials";

const log = (text: string) => console.log(`[AuthProvider]: ${text}`);

type LoginFn = (username?: string, password?: string) => void;

export interface AuthState {
    authenticationError: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login?: LoginFn;
    logout?: () => void;
    pendingAuthentication?: boolean;
    username?: string;
    password?: string;
    token: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    token: '',
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
    children: React.ReactNode,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>(initialState);
    const { isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token } = state;
    const login = loginCallback;
    const logout = () => {
        alert('logout');
        setState({
            ...state,
            isAuthenticated: false,
            token: '',
        });
        tokenStorage.remove('token');
    };
    useEffect(authenticationEffect, [pendingAuthentication]);

    const value = { isAuthenticated, login, logout, isAuthenticating, authenticationError, token };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    function loginCallback(username?: string, password?: string): void {
        log(`login`);
        setState({
            ...state,
            pendingAuthentication: true,
            username,
            password
        });
    }

    function authenticationEffect() {
        let canceled = false;
        tokenStorage.get('token').then(token => {
            if (token) {
                setState({
                    ...state,
                    token,
                    pendingAuthentication: false,
                    isAuthenticated: true,
                });
            } else {
                authenticate().then(() => {
                    return () => {
                        canceled = true;
                    }
                });
            }
        }).catch(error => {
            log('authenticationEffect storage, error=' + error);
            setState({
                ...state,
                token: '',
                pendingAuthentication: false,
                isAuthenticated: false,
            });
        })

        async function authenticate() {
            if (!pendingAuthentication) {
                log('authenticate, !pendingAuthentication, return');
                return;
            }
            try {
                log('authenticate...');
                setState({
                    ...state,
                    isAuthenticating: true,
                });
                const { username, password } = state;
                loginApi(username, password).then(response => {
                    let token = response.data.token;
                    log('authenticate succeeded, token=' + token);
                    setState({
                        ...state,
                        token,
                        pendingAuthentication: false,
                        isAuthenticated: true,
                        isAuthenticating: false,
                    });
                    tokenStorage.set('token', token);
                })

            } catch (error) {
                if (canceled) {
                    return;
                }
                log('authenticate failed');
                setState({
                    ...state,
                    authenticationError: error as Error,
                    pendingAuthentication: false,
                    isAuthenticating: false,
                });
            }
        }
    }
};
