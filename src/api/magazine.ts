import {axiosInstance} from "./axiosInstance";

export class Magazin {
    _id?: number;
    name: string = "";
    lat: number = 0;
    long: number = 0;
    date: Date = new Date();
    hasDelivery: boolean = false;
}

const MAGAZINE_URL = "/magazine";

export const magazineApi = {
    getMagazine: (config?) => {
        return axiosInstance.get(MAGAZINE_URL, config)
    },
    getMagazin: (id: string, config?) => {
        return axiosInstance.get(`${MAGAZINE_URL}/${id}`, config)
    },
    createMagazine: (data: Magazin, config?) => {
        return axiosInstance.post(MAGAZINE_URL, data, config)
    },
    updateMagazine: (id: string, data: Magazin, config?) => {
        return axiosInstance.put(`${MAGAZINE_URL}/${id}`, data, config)
    },
    deleteMagazine: (id: string, config?) => {
        return axiosInstance.delete(`${MAGAZINE_URL}/${id}`, config)
    }
}

interface MessageData {
    event: string;
    payload: {
        item: Magazin;
    }
}

export const magazineSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const socket = new WebSocket("ws://localhost:3000");
    socket.onopen = () => {
        console.log("Connecting to WS server...");
        socket.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    }
    socket.onclose = () => {
        console.log("Disconnected from WS server");
    }
    socket.onerror = (error) => {
        console.log("WS Error: ", error);
    }
    socket.onmessage = (message) => {
        console.log("Message received: ", message.data);
        const data: MessageData = JSON.parse(message.data);
        onMessage(data);
    }
    return () => {
        socket.close();
    }
}