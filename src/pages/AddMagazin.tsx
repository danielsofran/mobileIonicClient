import {IonContent, IonPage} from "@ionic/react";
import MagazinForm from "../components/MagazinForm";
import {magazineApi} from "../api/magazine";
import {useContext, useEffect} from "react";
import {AuthContext} from "../context/AuthProvider";
import {authConfig} from "../api/axiosInstance";
import {addMagazinToStorage, magazineStorage} from "../storage/magazine";
import {PrivateContent} from "../context/PrivateContent";


export default function AddMagazin({history}) {
    const {token, isAuthenticated} = useContext(AuthContext)
    console.log("Addmagazin", token)

    const saveMagazin = (magazin) => {
        magazineApi.createMagazine(magazin, authConfig(token)).then( response => {
            switch (response.status) {
                case 201:
                    history.push('/home');
                    window.location.reload();
                    break;
                default:
                    alert(response.data.issue);
            }
        }).catch( async error => {
            alert(error)
            error?.response?.data?.issue?.forEach((issue) => {
                alert(issue.error);
            });
            addMagazinToStorage(magazin).then(() => {
                history.push('/home');
                window.location.reload();
            }).catch(errorStorage => {
                alert(errorStorage)
            })
        })
    }

    return (
        <IonPage>
            <IonContent style={{margin: 30}}>
                {isAuthenticated ? <>
                    <h1> Add Magazin </h1>
                    <div>
                        <MagazinForm onSave={saveMagazin}/>
                    </div>
                </> : <div> Not authenticated! </div> }
            </IonContent>
        </IonPage>
    )
}