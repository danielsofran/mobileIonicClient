import {useContext, useState} from 'react';
import {Magazin, magazineApi, MagazinOffline} from '../api/magazine';
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
import {AuthContext} from "../context/AuthProvider";
import {authConfig} from "../api/axiosInstance";
import {getMagazinFromStorage, updateMagazinInStorage} from "../storage/magazine";


function ViewMagazin({history}) {
  const token = useContext(AuthContext).token
  const [magazin, setMagazin] = useState<Magazin>();
  const [showEdit, setShowEdit] = useState(false);
  const params = useParams<{ id: string }>();

  const formatDate = (date: Date) => {
    let newDate = new Date(date);
    return newDate.toLocaleDateString('ro-RO', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'});
  }

  useIonViewWillEnter(() => {
    magazineApi.getMagazin(params.id!, authConfig(token)).then((response) => {
      setMagazin(response.data);
    }).catch(errorApi => {
      getMagazinFromStorage(params.id!).then((magazin: MagazinOffline) => {
        setMagazin(magazin.magazin);
      }).catch(errorStorage => {
        alert("Magazinul nu a fost gasit");
      })
    });
  });

  const save = (newMagazin: Magazin) => {
    magazineApi.updateMagazine(magazin!._id!, newMagazin, authConfig(token)).then(() => {
      setMagazin(newMagazin)
      setShowEdit(false);
    }).catch(errorApi => {
      const show = () => alert(errorApi.response.data.issue.map((it: any) => it.error).join(', '));
      updateMagazinInStorage(magazin!._id!, newMagazin!).then(() => {
        setMagazin(newMagazin)
        setShowEdit(false);
      }).catch(errorStorage => {
        show();
      })
    });
  }

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
              <MagazinForm onSave={(newMagazin) => save(newMagazin)} magazin={magazin} />
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
