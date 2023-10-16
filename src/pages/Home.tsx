import MagazineListItem from '../components/MessageListItem';
import {useEffect, useState} from 'react';
import {Magazin, magazineApi, magazineSocket} from '../api/magazine';
import {
  IonContent, IonFab, IonFabButton,
  IonHeader, IonIcon,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Home.css';
import {a} from "vitest/dist/types-198fd1d9";
import {add} from "ionicons/icons";
import {RouteComponentProps} from "react-router";

const Home: React.FC<RouteComponentProps> = ({history}) => {

  const [magazine, setMagazine] = useState<Magazin[]>([]);
  const [error, setError] = useState<string|undefined>();

  useEffect(() => {
    magazineApi.getMagazine().then( response => {
      setMagazine(response.data);
    }).catch( error => {
      setError(error.message)
    });
  }, []);

  useEffect(() => {
    let canceled = false;
    console.log('wsEffect - connecting');
    const closeWebSocket = magazineSocket(message => {
      if (canceled) {
        return;
      }
      const { event, payload: { item: magazin }} = message;
      console.log(`ws message, item ${event}`, magazin);
      if (event === 'created' || event === 'updated') {
        setMagazine(magazine => {
          const index = magazine.findIndex(it => it.id === magazin.id);
          if (index === -1) {
            magazine.push(magazin);
          } else {
            magazine[index] = magazin;
          }
          return [...magazine];
        });
      }
    });
    return () => {
      console.log('wsEffect - disconnecting');
      canceled = true;
      closeWebSocket();
    }
  }, [magazine]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 10);
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista magazine</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              Lista magazine
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        {error ? <div>{error}</div> :
            <IonList>
              {magazine.length > 0 ? (
                  magazine.map((magazin) => (
                      <MagazineListItem key={magazin.id} magazin={magazin}/>
                  ))
              ) : (
                  <div className="ion-padding">No messages found.</div>
              )}
            </IonList>
        }

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {history.push('/magazin/add'); window.location.reload()}}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
