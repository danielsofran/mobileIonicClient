import { Directory, Filesystem } from '@capacitor/filesystem';
import { useCallback } from 'react';

export function useFilesystem() {
  const readFile = useCallback<(path: string) => Promise<string|Blob>>(
    (path) =>
      Filesystem.readFile({
        path,
        directory: Directory.Data,
      }).then(result => result.data), []);

  const writeFile = useCallback<(path: string, data: string) => Promise<any>>(
    (path, data) => {
      console.log(Directory.Data)
      return Filesystem.writeFile({
        path,
        data,
        directory: Directory.Data,
      })}, []);

  const deleteFile = useCallback<(path: string) => Promise<void>>(
    (path) =>
      Filesystem.deleteFile({
        path,
        directory: Directory.Data,
      }), []);

  return {
    readFile,
    writeFile,
    deleteFile
  };
}

async function base64FromPath(path: string): Promise<unknown> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('method did not return a string');
            }
        };
        reader.readAsDataURL(blob);
    });
}
