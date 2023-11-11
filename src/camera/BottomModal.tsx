import {close, download, trash} from "ionicons/icons";
import {IonActionSheet} from "@ionic/react";
import React, {useState} from "react";
import {MyPhoto, usePhotos} from "./usePhotos";

interface BottomModalProps {
  photos: MyPhoto[];
  selected: MyPhoto | undefined;
  setSelected: (photo: MyPhoto | undefined) => void;
}

export default function BottomModal(props: BottomModalProps) {
  const { deletePhoto, downloadPhoto } = usePhotos();
  const selectedPhoto = props.selected;
  const setSelectedPhoto = props.setSelected;

  const createAElemThenClick = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
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
            downloadPhoto(selectedPhoto).then((response) => {
              createAElemThenClick(selectedPhoto.webviewPath!)
              setSelectedPhoto(selectedPhoto);
            })
          }
        }
      }, {
        text: 'Cancel',
        icon: close,
        role: 'cancel'
      }]}
      onDidDismiss={() => setSelectedPhoto(undefined)}
    />
  );
}