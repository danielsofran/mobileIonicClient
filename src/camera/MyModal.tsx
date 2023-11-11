import React, {useContext, useState} from 'react';
import {createAnimation, IonModal, IonButton, IonContent, IonIcon} from '@ionic/react';
import {camera} from "ionicons/icons";

export const MyModal: React.FC <{ takePhoto: any}> = ({ takePhoto }) => {
  const [showModal, setShowModal] = useState(false);
  const enterAnimation = (baseEl: any) => {
    const root = baseEl.shadowRoot;
    const backdropAnimation = createAnimation()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' }
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }

  const leaveAnimation = (baseEl: any) => {
    return enterAnimation(baseEl).direction('reverse');
  }

  console.log('MyModal', showModal);
    return (
        <>
            <IonModal isOpen={showModal} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                <IonButton slot='end' onClick={() => takePhoto()}>
                    Take Photo
                </IonButton>
                <IonButton onClick={() => setShowModal(false)}>Cancel</IonButton>
            </IonModal>
            <IonButton slot='end' onClick={() => setShowModal(true)}><IonIcon icon={camera}/></IonButton>
        </>
    );
};
