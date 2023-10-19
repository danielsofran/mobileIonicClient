import {IonContent} from "@ionic/react";
import MagazinForm from "../components/MagazinForm";
import {magazineApi} from "../api/magazine";
import {useContext} from "react";
import {AuthContext} from "../context/AuthProvider";
import {authConfig} from "../api/axiosInstance";


export default function AddMagazin({history}) {
    const token = useContext(AuthContext).token

    return (
        <IonContent style={{margin: 30}}>
            <h1> Add Magazin </h1>
            <div>
                <MagazinForm onSave={(magazin) =>{
                    magazineApi.createMagazine(magazin, authConfig(token)).then( response => {
                        switch (response.status) {
                            case 201:
                                history.push('/home');
                                window.location.reload();
                                break;
                            default:
                                alert(response.data.issue);
                        }
                    }).catch( error => {
                        error.response.data.issue.forEach((issue) => {
                            alert(issue.error);
                        });
                    })
                }}/>
            </div>
        </IonContent>
    )
}