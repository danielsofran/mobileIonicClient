import {axiosInstance} from "./axiosInstance";

export class Magazin {
    _id?: string;
    name: string = "";
    lat: number = 0;
    long: number = 0;
    date: Date = new Date();
    hasDelivery: boolean = false;
}

export class MagazinOffline {
    magazin: Magazin;
    state: "read" | "created" | "updated";

    constructor(magazin: Magazin, state: "read" | "created" | "updated" = "read") {
        this.magazin = magazin;
        this.state = state;
    }
}

const MAGAZINE_URL = "/magazine";

export const magazineApi = {
    getMagazine: (config, page?, name?, hasDelivery?) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (name) params.append("name", name);
        //if (hasDelivery) params.append("hasDelivery", hasDelivery.toString());
        return axiosInstance.get(MAGAZINE_URL, { ...config, params })
    },
    getMagazin: (id: string, config) => {
        return axiosInstance.get(`${MAGAZINE_URL}/${id}`, config)
    },
    createMagazine: (data: Magazin, config) => {
        return axiosInstance.post(MAGAZINE_URL, data, config)
    },
    updateMagazine: (id: string, data: Magazin, config) => {
        return axiosInstance.put(`${MAGAZINE_URL}/${id}`, data, config)
    },
    deleteMagazine: (id: string, config) => {
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