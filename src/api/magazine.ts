import {axiosInstance} from "./axiosInstance";

export class Magazin {
    id?: number;
    name: string = "";
    lat: number = 0;
    long: number = 0;
    date: Date = new Date();
    hasDelivery: boolean = false;
}

const MAGAZINE_URL = "/magazine";

export const magazineApi = {
    getMagazine: () => {
        return axiosInstance.get(MAGAZINE_URL)
    },
    getMagazin: (id: string) => {
        return axiosInstance.get(`${MAGAZINE_URL}/${id}`)
    },
    createMagazine: (data: Magazin) => {
        return axiosInstance.post(MAGAZINE_URL, data)
    },
    updateMagazine: (id: string, data: Magazin) => {
        return axiosInstance.put(`${MAGAZINE_URL}/${id}`, data)
    },
    deleteMagazine: (id: string) => {
        return axiosInstance.delete(`${MAGAZINE_URL}/${id}`)
    }
}

interface MessageData {
    event: string;
    payload: {
        item: Magazin;
    }
}

export const magazineSocket = (onMessage: (data: MessageData) => void) => {
    const socket = new WebSocket("ws://localhost:3000");
    socket.onopen = () => {
        console.log("Connected to WS server");
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