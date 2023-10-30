import {Storage} from "@ionic/storage";
import {Magazin, magazineApi, MagazinOffline} from "../api/magazine";
import {authConfig} from "../api/axiosInstance";
import {d} from "vitest/dist/types-198fd1d9";

const magazineStorage = new Storage({
    name: 'magazine',
})

magazineStorage.create();

export const backOnline = async (token?: string, data?: Magazin[]) => {
    const magazine = []
    const magazineAdded = []
    const magazineUpdated = []
    await magazineStorage.forEach((value, key, index) => {
        if (value.state === "created") {
            magazineAdded.push(value.magazin)
        } else if (value.state === "updated") {
            magazineUpdated.push(value.magazin)
        }
        magazine.push(value.magazin)
    })
    for (const magazin of magazineAdded) {
        await magazineApi.createMagazine(magazin, authConfig(token))
    }
    for (const magazin of magazineUpdated) {
        await magazineApi.updateMagazine(magazin._id!, magazin, authConfig(token))
    }
    console.log("[BACK ONLINE] Magazine added: ", magazineAdded)
    console.log("[BACK ONLINE] Magazine updated: ", magazineUpdated)
    console.log("[BACK ONLINE] Magazine: ", magazine)

    await magazineStorage.clear()
    if(data)
        data.forEach(async magazin => await magazineStorage.set(magazin._id!, new MagazinOffline(magazin)));
    else {
        magazineApi.getMagazine(authConfig(token)).then(async response => {
            const data = response.data;
            data.forEach(async magazin => await magazineStorage.set(magazin._id!, new MagazinOffline(magazin)));
        })
    }

}

export const getMagazineFromStorage = async () => {
    const magazine = []
    await magazineStorage.forEach((value, key, index) => {
        magazine.push(value.magazin)
    })
    return magazine;
}

export const getMagazinFromStorage = async (id: string) => {
    return await magazineStorage.get(id);
}

export const addMagazinToStorage = async (magazin: Magazin) => {
    let randomId = Math.floor(Math.random() * 1000000000000000000).toString();
    // check id not to be already in use
    while(await magazineStorage.get(randomId)) {
        randomId = Math.floor(Math.random() * 1000000000000000000).toString();
    }
    await magazineStorage.set(randomId, new MagazinOffline(magazin, "created"));
}

export const updateMagazinInStorage = async (id: string, magazin: Magazin) => {
    await magazineStorage.set(id, new MagazinOffline(magazin, "updated"));
}

export {magazineStorage}