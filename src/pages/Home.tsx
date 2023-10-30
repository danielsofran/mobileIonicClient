import MagazineListItem from '../components/MessageListItem';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Magazin, magazineApi, magazineSocket, MagazinOffline} from '../api/magazine';
import {
  IonButton,
  IonContent, IonFab, IonFabButton,
  IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent, IonSearchbar, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './Home.css';
import {add} from "ionicons/icons";
import {RouteComponentProps} from "react-router";
import {AuthContext} from "../context/AuthProvider";
import {authConfig} from "../api/axiosInstance";
import {backOnline, getMagazineFromStorage, magazineStorage} from "../storage/magazine";
import {DisplayNetworkStatus} from "../components/DisplayNetworkStatus";

class SearchParams {
    searchText?: string;
    page: number = 1;
    hasDelivery?: boolean;
}

const Home: React.FC<RouteComponentProps> = ({history}) => {
  const state = useContext(AuthContext)

  const [searchParams, setSearchParams] = useState(new SearchParams())
  const [tempText, setTempText] = useState('');
  const [magazine, setMagazine] = useState<Magazin[]>([]);
  const [error, setError] = useState<string|undefined>();

  const [status, setStatus] = useState<string>("OFFLINE");
  const count = useRef(0);

  useEffect(() => {
    let canceled = false;
    const token = state.token;
    console.log('wsEffect - connecting');
    let closeWebSocket: () => void;
    if (token?.trim()) {
      closeWebSocket = magazineSocket(token, message => {
        if (canceled) {
          return;
        }
        const { type, payload: item } = message;
        console.log(`ws message, item ${type}`);
        if (type === 'created' || type === 'updated') {
          console.log("ITEM=", item)
        }
      });
    }
    return () => {
      console.log('wsEffect - disconnecting');
      canceled = true;
      closeWebSocket?.();
    }
    }, [state.token]);

  useEffect(() => {
    if(count.current === 0) {
      magazineApi.getMagazine(authConfig(state.token)).then(async response => {
        await backOnline(state.token, response.data);
        setStatus("ONLINE");
      }).catch(async error => {
        setStatus("OFFLINE");
      });
    }
    count.current++;
  }, []);

  const fetchPage = async () => {
    let search = searchParams.searchText?.length > 0 ? searchParams.searchText : undefined;
    let hasDelivery = searchParams.hasDelivery;
    if(hasDelivery !== undefined) {
        search = undefined;
    }
    return await magazineApi.getMagazine(authConfig(state.token), searchParams.page, search, hasDelivery).then( response => {
      if(!response.data || response.data.length === 0 || !response.data instanceof Array || response.data == "OK") {
        return "FINISH";
      }
      setMagazine(magazine =>
          magazine.concat(
              response.data.filter(
                  (magazin: Magazin) => magazine.findIndex((it: Magazin) => it._id === magazin._id) < 0
              )
          )
      );
      return "OK";
    }).catch( async error => {
      return "FAIL"
    })
  }

  const searchNext = async (e: CustomEvent<void>) => {
    console.log("SEARCH NEXT, page=", searchParams.page)
    const result = await fetchPage();
    await (e.target as HTMLIonInfiniteScrollElement).complete();
    console.log("RESULT=", result)
    if(result === "OK") {
      await setSearchParams(searchParams => { return {...searchParams, page: searchParams.page + 1}})
    }
  }

  useEffect(() => {
    if(status === "ONLINE") {
      setMagazine([])
      const page1 = Promise.resolve(() => setSearchParams(searchParams => { return {...searchParams, page: 1}}))
      page1.then(() => fetchPage()).then(() => {
        setSearchParams(searchParams => { return {...searchParams, page: 2}})
      })
    }
    else {
      const getall = async () => setMagazine(await getMagazineFromStorage())
      getall();
    }
  }, [status, searchParams.searchText]);

  const logout = () => {
    state.logout?.();
  }

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 10);
  };

  const search = () => {
    if(tempText === "") {
      window.location.reload();
    }
    const setter = async () => {
      setSearchParams({searchText: tempText, page: 1})
      setMagazine([])
    }
    setter().then(() => {
      fetchPage()
      //setSearchParams(searchParams => { return {...searchParams, page: 2}})
    })
  }

  const filter = () => {
    const hasDelivery = searchParams.hasDelivery;
    return magazine.filter(magazin => {
        if(hasDelivery === undefined) {
            return true;
        }
        return magazin.hasDelivery === hasDelivery;
    })
  }

  const filterChange = (e) => {
    const hasDelivery = e.detail.value;
    setSearchParams(searchParams => { return {...searchParams, hasDelivery: hasDelivery, page: 1}})
  }

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista magazine</IonTitle>
        </IonToolbar>
        <IonButton onClick={logout}>Logout</IonButton>
        <DisplayNetworkStatus status={status}/>
        <IonButton onClick={search}>Search</IonButton>
        <IonSelect onIonChange={filterChange} placeholder="Delivery?">
          <IonSelectOption value={true} >Has delivery</IonSelectOption>
          <IonSelectOption value={false}>Does not have</IonSelectOption>
        </IonSelect>
        <IonSearchbar value={searchParams.searchText} onIonChange={e => setTempText(e.detail.value!)}></IonSearchbar>
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

        {error ? <IonContent>{error}</IonContent> :
            <IonList>
              {filter().length > 0 ? (
                  filter().map((magazin, index) => (
                      <MagazineListItem key={index} magazin={magazin}/>
                  ))
              ) : (
                  <div className="ion-padding">No messages found.</div>
              )}
              {status === "ONLINE" &&
                  <IonInfiniteScroll onIonInfinite={searchNext}>
                    <IonInfiniteScrollContent
                        loadingText="Loading magazine...">
                    </IonInfiniteScrollContent>
                  </IonInfiniteScroll>
              }
            </IonList>
        }

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {history.push('/magazin/add');}}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
