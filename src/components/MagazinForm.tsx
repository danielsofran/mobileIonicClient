import {Magazin} from "../api/magazine";
import {useState} from "react";
import {IonButton, IonCheckbox, IonContent, IonDatetime, IonInput, IonItemDivider} from "@ionic/react";

interface FormProps {
    magazin?: Magazin;
    onSave: (magazin: Magazin) => void;
}

export default function MagazinForm(props: FormProps) {
    const [magazin, setMagazin] = useState<Magazin>(props?.magazin || new Magazin());

    const date = new Date(magazin.date).toISOString();

    const setDate = (date: string) => {
        setMagazin({...magazin, date: new Date(date)});
        //console.log(magazin.date.toLocaleString())
    }

    const save = () => {
        props.onSave(magazin);
    }

    return (
        <>
            <IonInput value={magazin?.name} placeholder="Name" onIonChange={e => setMagazin({...magazin, name: e.detail.value || ''})} > Name</IonInput>
            <IonItemDivider/>
            <IonCheckbox checked={magazin?.hasDelivery} onIonChange={e => setMagazin({...magazin, hasDelivery: e.detail.checked} )} > Delivers Home </IonCheckbox>
            <IonItemDivider/>
            <IonDatetime value={date} onIonChange={e => setDate(e.detail.value)} > Date </IonDatetime>
            <IonItemDivider/>
            <IonButton onClick={save}>Save</IonButton>
        </>
    );
}