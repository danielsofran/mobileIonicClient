import {axiosInstance} from "./axiosInstance";

const AUTH_URL = "/auth";

export interface AuthProps {
    token: string;
}

export const loginApi = (username?: string, password?: string) => {
    return axiosInstance.post<AuthProps>(`${AUTH_URL}/login`, {username, password})
}