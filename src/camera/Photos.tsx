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
import BottomModal from "./BottomModal";

const Photos: React.FC = () => {
  const { photos, takePhoto } = usePhotos();
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

        <BottomModal photos={photos} selected={selectedPhoto} setSelected={setSelectedPhoto} />
      </IonContent>
    </IonPage>
  );
};

export default Photos;
