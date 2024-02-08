import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export interface IInputFileEntry {
  imageUploaded: (state:boolean) => void;
  setImage:(file:{name:string})=>void
}

export const InputFile = (props: IInputFileEntry) => {
  // Ajout d'un état pour stocker le fichier sélectionné
  const [file, setFile] = useState<{ name: string } | null>(null);

  // Fonction pour gérer le changement de l'input et stocker le fichier
  const handleFileChange = (event: { target: any }) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      props.imageUploaded(true);
      props.setImage(event.target.files[0])
      setFile(uploadedFile);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" onChange={handleFileChange} />
      {/* Optionnel : Afficher le nom du fichier sélectionné */}
      {file && <div>File selected: {file.name}</div>}
    </div>
  );
};
