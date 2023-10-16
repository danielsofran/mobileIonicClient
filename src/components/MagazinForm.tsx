import {Magazin} from "../api/magazine";
import {useState} from "react";
import {IonButton, IonCheckbox, IonContent, IonDatetime, IonInput, IonItemDivider} from "@ionic/react";

interface FormProps {
    magazin?: Magazin;
    onSave: (magazin: Magazin) => void;
}

export default function MagazinForm(props: FormProps) {
    const [magazin, setMagazin] = useState<Magazin>(props?.magazin || new Magazin());

    return (
        <>
            <IonInput value={magazin?.name} placeholder="Name" onIonChange={e => setMagazin({...magazin, name: e.detail.value || ''})} > Name</IonInput>
            <IonItemDivider/>
            <IonCheckbox checked={magazin?.hasDelivery} onIonChange={e => setMagazin({...magazin, hasDelivery: e.detail.checked} )} > Delivers Home </IonCheckbox>
            <IonItemDivider/>
            <IonDatetime value={magazin?.date} onIonChange={e => setMagazin({...magazin, date: new Date(e.detail.value || '')} )} > Date </IonDatetime>
            <IonItemDivider/>
            <IonButton onClick={() => props.onSave(magazin)}>Save</IonButton>
        </>
    );
}