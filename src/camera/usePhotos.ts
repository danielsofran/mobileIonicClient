import { useEffect, useState } from 'react';
import { useCamera } from './useCamera';
import { useFilesystem } from './useFilesystem';
import { usePreferences } from './usePreferences';

export interface MyPhoto {
  filepath: string;
  webviewPath?: string;
}

const PHOTOS = 'photos';

export function usePhotos() {
  const [photos, setPhotos] = useState<MyPhoto[]>([]);
  const { getPhoto } = useCamera();
  const { readFile, writeFile, deleteFile } = useFilesystem();
  const { get, set } = usePreferences();
  useEffect(loadPhotos, [get, readFile, setPhotos]);
  return {
    photos,
    takePhoto,
    deletePhoto,
    downloadPhoto
  };

  async function takePhoto(filename?: string) {
    const { base64String } = await getPhoto();
    const filepath = filename ? filename : new Date().getTime() + '.jpeg';
    await writeFile(filepath, base64String!);
    const webviewPath = `data:image/jpeg;base64,${base64String}`
    const newPhoto = { filepath, webviewPath };
    const reducedPhotos = photos.filter(p => p.filepath !== filepath)
    const newPhotos = [newPhoto, ...reducedPhotos];
    await set(PHOTOS, JSON.stringify(newPhotos));
    setPhotos(newPhotos);
  }

  async function deletePhoto(photo: MyPhoto) {
    const newPhotos = photos.filter(p => p.filepath !== photo.filepath);
    await set(PHOTOS, JSON.stringify(newPhotos));
    await deleteFile(photo.filepath);
    setPhotos(newPhotos);
  }

  async function downloadPhoto(photo: MyPhoto) {
    await writeFile(photo.filepath, photo.webviewPath!).then(x => console.log(x)).catch(x => console.warn(x));
  }

  function loadPhotos() {
    loadSavedPhotos();

    async function loadSavedPhotos() {
      const savedPhotoString = await get(PHOTOS);
      const savedPhotos = (savedPhotoString ? JSON.parse(savedPhotoString) : []) as MyPhoto[];
      console.log('load', savedPhotos);
      for (let photo of savedPhotos) {
        const data = await readFile(photo.filepath);
        photo.webviewPath = `data:image/jpeg;base64,${data}`;
      }
      setPhotos(savedPhotos);
    }
  }
}
