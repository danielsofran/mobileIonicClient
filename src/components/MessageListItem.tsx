import {
  IonItem,
  IonLabel,
  IonNote
  } from '@ionic/react';
import { Magazin } from '../api/magazine';
import './MessageListItem.css';

interface MessageListItemProps {
  magazin: Magazin;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ magazin }) => {

  const formatDate = (date: Date) => {
    let newDate = new Date(date);
    return newDate.toLocaleDateString('ro-RO', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'});
  }

  return (
    <IonItem routerLink={`/magazine/${magazin.id}`} detail={false}>
      <div slot="start" className="dot"></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {magazin.name}
          <span className="date">
            <IonNote>{formatDate(magazin.date)}</IonNote>
          </span>
        </h2>
        <ion-toggle slot='start' checked={magazin.hasDelivery.toString()} disabled="true">Derivers at home</ion-toggle>
      </IonLabel>
    </IonItem>
  );
};

export default MessageListItem;
