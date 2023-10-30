import {RouteComponentProps} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthProvider";
import {IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar} from "@ionic/react";

const log = (...args: any[]) => console.log('[Login]', ...args);

interface LoginState {
    username?: string;
    password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
    const { isAuthenticated, isAuthenticating, login, authenticationError, token } = useContext(AuthContext);
    const [state, setState] = useState<LoginState>({});
    const { username, password } = state;
    const handlePasswwordChange = useCallback((e: any) => setState({
        ...state,
        password: e.detail.value || ''
    }), [state]);
    const handleUsernameChange = useCallback((e: any) => setState({
        ...state,
        username: e.detail.value || ''
    }), [state]);
    const handleLogin = useCallback(() => {
        log('handleLogin...');
        login?.(username, password);
    }, [username, password]);
    useEffect(() => {
        if (isAuthenticated) {
            log('redirecting to home');
            history.push('/home');
        }
    }, [isAuthenticated]);
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput
                    placeholder="Username"
                    value={username}
                    onIonChange={handleUsernameChange}/>
                <IonInput
                    placeholder="Password"
                    value={password}
                    onIonChange={handlePasswwordChange}/>
                <IonLoading isOpen={isAuthenticating}/>
                {authenticationError && (
                    <div>{authenticationError.message || 'Failed to authenticate'}</div>
                )}
                <IonButton onClick={handleLogin}>Login</IonButton>
            </IonContent>
        </IonPage>
    );
};
