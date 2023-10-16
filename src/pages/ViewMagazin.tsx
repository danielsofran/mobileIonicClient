import { useState } from 'react';
import { Magazin, magazineApi } from '../api/magazine';
import {
  IonBackButton, IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import { useParams } from 'react-router';
import './ViewMessage.css';
import MagazinForm from "../components/MagazinForm";


function ViewMagazin({history}) {
  const [magazin, setMagazin] = useState<Magazin>();
  const [showEdit, setShowEdit] = useState(false);
  const params = useParams<{ id: string }>();

  const formatDate = (date: Date) => {
    let newDate = new Date(date);
    return newDate.toLocaleDateString('ro-RO', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'});
  }

  useIonViewWillEnter(() => {
    magazineApi.getMagazin(params.id!).then((response) => {
      setMagazin(response.data);
    });
  });

  return (
    <IonPage id="view-message-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Inbox" defaultHref="/home"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {magazin ? (
          <>
            <IonItem style={{marginLeft: 20}}>
              <IonLabel className="ion-text-wrap">
                <h2>
                  {magazin.name}
                </h2>
                <h3>
                  Deschis in data de: <IonNote>{formatDate(magazin.date)}</IonNote>
                </h3>
                <ion-toggle slot='start' checked={magazin.hasDelivery.toString()} disabled="true">Derivers at home</ion-toggle>
              </IonLabel>
            </IonItem>

            <div className="ion-padding">
              <p>
                Magazinul acesta a fost adaugat de catre unul din utilizatorii aplicatiei. Daca doresti sa adaugi si tu un magazin, te rugam sa ne contactezi la adresa de email: <IonNote> magazin@yahoo.com </IonNote>
              </p>
            </div>

            {showEdit ? <>
              <MagazinForm onSave={newMagazin => {
                console.log(newMagazin);
                magazineApi.updateMagazine(magazin!.id?.toString(), newMagazin).then(() => {
                  history.push('/home');
                  window.location.reload();
                }).catch(error => {
                  alert(error.response.data.issue.map((it: any) => it.error).join(', '));
                });
              }} magazin={magazin} />
              <IonButton onClick={() => setShowEdit(false)}>Cancel</IonButton>
            </> :
                <IonButton onClick={() => setShowEdit(true)}>Edit</IonButton>
            }

          </>
        ) : (
          <div>Magazinul nu a fost gasit</div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewMagazin;
