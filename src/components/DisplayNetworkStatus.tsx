import { Network } from "@capacitor/network";
import React from "react";
import {IonButton} from "@ionic/react";

export const DisplayNetworkStatus: React.FC = (props) => {
    const [status, setStatus] = React.useState<string>('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const connectionStatus = await Network.getStatus();
                setStatus(connectionStatus.connected ? 'ONLINE' : 'OFFLINE')
                const handleNetworkStatusChange = (status) => {
                    setStatus(status.connected ? 'ONLINE' : 'OFFLINE');
                };

                Network.addListener('networkStatusChange', handleNetworkStatusChange);

                return () => {
                    Network.removeAllListeners()
                }
            } catch (error) {
                // Handle any errors here
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the async function immediately
    }, []);

    return (
            <IonButton>Network: {status}   API: {props?.status || ''}</IonButton>
    )
}