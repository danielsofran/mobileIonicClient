import {Magazin} from "../api/magazine";
import {useState} from "react";
import {IonButton, IonCheckbox, IonContent, IonDatetime, IonInput, IonItemDivider} from "@ionic/react";
import {ViewMap} from "../maps/ViewMap";

interface FormProps {
    magazin?: Magazin;
    onSave: (magazin: Magazin) => void;
}

export default function MagazinForm(props: FormProps) {
    const [magazin, setMagazin] = useState<Magazin>(props?.magazin || new Magazin());
    const magazinCoords = {
        lat: magazin?.lat || 0,
        lng: magazin?.long || 0,
    };

    return (
        <>
            <IonInput value={magazin?.name} placeholder="Name" onIonChange={e => setMagazin({...magazin, name: e.detail.value || ''})} > Name</IonInput>
            <IonItemDivider/>
            <IonCheckbox checked={magazin?.hasDelivery} onIonChange={e => setMagazin({...magazin, hasDelivery: e.detail.checked} )} > Delivers Home </IonCheckbox>
            <IonItemDivider/>
            <IonDatetime value={magazin?.date} onIonChange={e => setMagazin({...magazin, date: new Date(e.detail.value || '')} )} > Date </IonDatetime>
            <IonItemDivider/>
            <ViewMap coords={magazinCoords} onCoordsChange={(coords) => setMagazin({...magazin, lat: coords.lat, long: coords.lng})} />
            <IonItemDivider/>
            <IonButton onClick={() => props.onSave(magazin)}>Save</IonButton>
        </>
    );
}