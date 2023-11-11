import {useCallback, useEffect, useState} from "react";
import {usePhotos} from "../camera/usePhotos";
import {IonImg, IonText} from "@ionic/react";

export const MagazinImage = ({ magazinId }) => {
    const {photos} = usePhotos();
    const [photoSrc, setPhotoSrc] = useState<string>('');

    const [, updateState] = useState<any>();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        if (magazinId) {
            photos.forEach((photo) => {
                if (photo.filepath === 'id=' + magazinId + '.jpeg') {
                    console.log(photo)
                    setPhotoSrc(photo.webviewPath!);
                }
            })
        }
        else {
            setPhotoSrc('');
        }
    });

    return (
      <div style={{width: "30%"}} onClick={() => forceUpdate()}>
          {photoSrc.length > 0 ?
            <IonImg src={photoSrc}/> :
            <p>No image found</p>
          }
      </div>
    );
}