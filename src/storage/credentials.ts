import {Storage} from "@ionic/storage";

const tokenStorage = new Storage({
    name: 'token',
})

tokenStorage.create();

export {tokenStorage}

