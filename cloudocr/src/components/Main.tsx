import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Rectangle } from "./Rectangle";
import { toast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { InputFile } from "./InputFile";
import axios from "axios";
import { IFile } from "../models";

let index = 0;
const colors = [
  "red",
  "blue",
  "green",
  "orange",
  "yellow",
  "purple",
  "pink",
  "teal",
  "brown",
  "gray",
  "black",
  "white",
  "cyan",
  "magenta",
  "lime",
  "indigo",
  "silver",
  "gold",
  "olive",
  "navy",
];

// const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Choix d'une couleur au hasard
const randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export interface IRect {
  id: number;
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
}
interface IInput {
  inputs: IInputComponent[];
}

interface IInputComponent {
  name: string;
  rectangle: Rectangle;
}

interface Rectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const Main = () => {
  const [rectangles, setRectangles] = useState<IRect[]>([]);
  const [imgLoaded,setImgLoaded] = useState(false)
  const [img,setImg] = useState<IFile|null>(null)
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageId,setImageId] = useState<string>("")

  const checkName = (name: string): string => {
    let newName = name;
    let counter = 2;

    // Vérifie si le nom existe déjà dans la liste
    let nameExists = rectangles.some((rectangle) => rectangle.name === newName);

    // Si le nom existe déjà, incrémente le nom avec un nombre
    while (nameExists) {
      // Vérifie si le nom se termine déjà par un nombre
      const endsWithNumber = /\d+$/.test(newName);

      if (endsWithNumber) {
        // Si le nom se termine par un nombre, incrémente le nombre
        newName = newName.replace(/\d+$/, counter.toString());
      } else {
        // Si le nom ne se termine pas par un nombre, ajoute "2"
        newName = newName + "2";
      }

      // Vérifie à nouveau si le nom existe déjà
      nameExists = rectangles.some((rectangle) => rectangle.name === newName);

      counter++;
    }

    return newName;
  };

  const uploadImage = async (image:File) => {
    const formData = new FormData()
    formData.append('userId', "test")
    formData.append('image',image)
    
    try{
      const response = await axios.post(`${process.env.REACT_APP_GATEWAY_URI}:${process.env.REACT_APP_GATEWAY_PORT}/upload`,formData)
      setImageId(response.data)
    }catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    const fetchImage = async () => {
      try{
        const response = await axios.get(`${process.env.REACT_APP_GATEWAY_URI}:${process.env.REACT_APP_GATEWAY_PORT}/image?id=${imageId}`)
        console.log(response.data);
        setImg(response.data)
        setImgLoaded(true)
      }catch(error){
        console.error(error)
      }
    }
    if(imageId!=""){
      fetchImage()
    }
  },[imageId])

  const recognize = async () => {
    const input: IInput = {
      inputs: [],
    };
    rectangles.forEach((rectangle) => {
      const inputComponent: IInputComponent = {
        name: rectangle.name,
        rectangle: {
          left: rectangle.left,
          top: rectangle.top,
          width: rectangle.width,
          height: rectangle.height,
        },
      };
      input.inputs.push(inputComponent);
    });
    try{
      const response = await axios.post(`${process.env.REACT_APP_GATEWAY_URI}:${process.env.REACT_APP_GATEWAY_PORT}/ocr?id=${imageId}`,input)
      toast({
        title: "You obtained the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(response.data, null, 2)}</code>
          </pre>
        ),
      }); 
    }catch(error){
      console.error(error)
    }
    
  };

  const fulltext = async () => {
    try{
      const response = await axios.get(`${process.env.REACT_APP_GATEWAY_URI}:${process.env.REACT_APP_GATEWAY_PORT}/ocr?id=${imageId}`)
      toast({
        title: "You obtained the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(response.data, null, 2)}</code>
          </pre>
        ),
      }); 
    }catch(error){
      console.error(error)
    }
  };

  const handleDestruct = () => {
    setImg(null)
    setImgLoaded(false)
    setRectangles([])
  }

  const handleAdd = () => {
    const rectangle: IRect = {
      id: index++,
      name: checkName("New Recognition"),
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      color: randomColor(),
    };
    const newList = [...rectangles];
    newList.push(rectangle);
    setRectangles(newList);
  };
  const updateRect = (rectangle: IRect) => {
    setRectangles((currentRectangles) => {
      // Trouver l'index du rectangle à mettre à jour dans le tableau actuel
      const index = currentRectangles.findIndex((r) => r.id === rectangle.id);

      // Si le rectangle existe (index !== -1), procéder à la mise à jour
      if (index !== -1) {
        // Créer une nouvelle copie du tableau en remplaçant l'élément à l'index trouvé
        const newRectangles = [...currentRectangles];
        newRectangles[index] = rectangle; // Met à jour l'élément avec les nouvelles données

        return newRectangles; // Retourne le nouveau tableau mis à jour
      }

      // Si l'élément n'est pas trouvé, retourne le tableau actuel sans modification
      return currentRectangles;
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100/40 dark:bg-gray-800/40">
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <a className="lg:hidden" href="#">
            <span className="sr-only">Home</span>
          </a>
          <h1 className="font-semibold text-lg md:text-2xl">Recognition</h1>
        </header>
        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex flex-row">
            <Sidebar
              active={imgLoaded}
              handleFulltext={fulltext}
              colors={colors}
              checkName={checkName}
              handleDestruct={handleDestruct}
              handleRecognize={recognize}
              imgLoaded={imgLoaded}
              rectangles={rectangles}
              handleAdd={handleAdd}
              updateRect={updateRect}
            />
            <div className="flex flex-col gap-10 items-center justify-center">
              <h1 className="font-semibold text-lg md:text-2xl text-center">
                {imgLoaded && img ? img.Name : "Product Name"}
              </h1>
              <div
                ref={imageRef}
                style={{
                  position: "relative",
                }}
              >
                {imgLoaded ?
                <img
                className="rounded-lg"
                src={`${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/images/${img?.Path}`}
                width={1000}
                style={{
                  objectFit: "cover",
                }}
              />
                :
                <InputFile uploadImage={uploadImage}/>
                }
                
                {rectangles.map((r) => (
                  <Rectangle
                    image={imageRef.current}
                    key={r.id}
                    rectangle={r}
                    update={updateRect}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};
