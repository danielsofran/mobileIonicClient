import {Magazin} from "../api/magazine";
import React, {useEffect, useState} from "react";
import {IonButton, IonCheckbox, IonContent, IonDatetime, IonIcon, IonImg, IonInput, IonItemDivider} from "@ionic/react";
import {ViewMap} from "../maps/ViewMap";
import {camera} from "ionicons/icons";
import {MyPhoto, usePhotos} from "../camera/usePhotos";
import {MagazinImage} from "./MagazinImage";

interface FormProps {
    magazin?: Magazin;
    onSave: (magazin: Magazin) => void;
}

export default function MagazinForm(props: FormProps) {
    const {takePhoto, deletePhoto} = usePhotos();
    const [magazin, setMagazin] = useState<Magazin>(props?.magazin || new Magazin());
    const magazinCoords = {
        lat: magazin?.lat || 0,
        lng: magazin?.long || 0,
    };

    const takeMagazinPhoto = () => {
      if(magazin.id) {
        const url = 'id=' + magazin.id + '.jpeg';
        const photo: MyPhoto = { filepath: url, webviewPath: url };
        deletePhoto(photo).then(() => {
          takePhoto(url)
        }).catch(() => {
          takePhoto(url)
        })
      }
    }

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
            <div>
              <IonButton onClick={takeMagazinPhoto}>
                <IonIcon icon={camera}/>
              </IonButton>
              <MagazinImage magazinId={magazin.id}/>
            </div>
            <IonButton onClick={() => props.onSave(magazin)}>Save</IonButton>
        </>
    );
}