import {
    IonActionSheet, IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader, IonIcon,
    IonImg,
    IonPage,
    IonRow,
    IonToolbar
} from '@ionic/react';
import { CreateAnimation } from '@ionic/react';
import React, {useEffect, useRef, useState} from 'react';
import { camera, close, download, trash } from 'ionicons/icons';
import { MyPhoto, usePhotos } from './usePhotos';
import {MyModal} from "./MyModal";
import {Title} from "./Title";

const Photos: React.FC = () => {
  const { photos, takePhoto, deletePhoto, downloadPhoto } = usePhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<MyPhoto>();
  const animationRef = useRef<CreateAnimation|undefined>(undefined);
  useEffect(simpleAnimationReact, [animationRef.current]);

  function simpleAnimationReact() {
      if (animationRef.current) {
          animationRef.current?.animation.play();
      }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <Title />
            <MyModal takePhoto = {takePhoto}/>
            <CreateAnimation
                ref={animationRef}
                duration={5000}
                direction={'alternate'}
                iterations={Infinity}
                keyframes={[
                    { offset: 0, transform: 'scale(1) rotate(0deg)', opacity: '1' },
                    { offset: 0.5, transform: 'scale(0.8) rotate(0deg)', opacity: '0.8' },
                    { offset: 1, transform: 'scale(1) rotate(0deg)', opacity: '1'}]}
            >
                <IonButton slot='end' onClick={() => takePhoto()}>
                    <IonIcon icon={camera}/>
                </IonButton>
            </CreateAnimation>
        </IonToolbar>

      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="3" key={index}>
                <IonImg onClick={() => setSelectedPhoto(photo)}
                        src={photo.webviewPath}/>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonActionSheet
          isOpen={!!selectedPhoto}
          buttons={[{
            text: 'Delete',
            role: 'destructive',
            icon: trash,
            handler: () => {
              if (selectedPhoto) {
                deletePhoto(selectedPhoto);
                setSelectedPhoto(undefined);
              }
            }
          }, {
            text: 'Save on device',
            icon: download,
            role: 'download',
            handler: () => {
              if(selectedPhoto) {
                downloadPhoto(selectedPhoto);
                setSelectedPhoto(selectedPhoto);
              }

            }
          }, {
            text: 'Cancel',
            icon: close,
            role: 'cancel'
            }]}
          onDidDismiss={() => setSelectedPhoto(undefined)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Photos;
