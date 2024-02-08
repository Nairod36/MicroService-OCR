import { useEffect, useRef, useState } from "react";
import { IRect } from "./Main";

export interface IRectangleEntry {
  rectangle: IRect;
  image: HTMLDivElement | null;
  update: (rectangle: IRect) => void;
}

export const Rectangle = (props: IRectangleEntry) => {
  const rectRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const img = props.image;

  useEffect(() => {
    window.addEventListener("mousemove", handleResize);
    // window.addEventListener('mouseup', () => setIsResizing(false));

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("mousemove", handleResize);
    };
  }, [props, isResizing]);

  const handleDragEnd = (e: { clientX: any; clientY: any }) => {
    const rect = rectRef.current;
    if (!isResizing && rect && img) {
      const rectBox = rect.getBoundingClientRect();
      const imgBox = img.getBoundingClientRect();

      // Calcul des nouvelles positions avec vérifications
      let newLeft = e.clientX - imgBox.left - cursorPosition.x;
      let newTop = e.clientY - imgBox.top - cursorPosition.y;

      // Empêcher le rectangle de dépasser le bord gauche de l'image
      newLeft = Math.max(newLeft, 0);
      // Empêcher le rectangle de dépasser le bord droit de l'image
      newLeft = Math.min(newLeft, imgBox.width - rectBox.width);

      // Empêcher le rectangle de dépasser le bord supérieur de l'image
      newTop = Math.max(newTop, 0);
      // Empêcher le rectangle de dépasser le bord inférieur de l'image
      newTop = Math.min(newTop, imgBox.height - rectBox.height);

      props.update({
        ...props.rectangle,
        left: newLeft,
        top: newTop,
      });
    }
  };

  const handleResize = (e: { clientX: number; clientY: number }) => {
    if (isResizing && img) {
      console.log("here");

      const imgBox = img.getBoundingClientRect();
      // Calculate new width and height
      let newWidth = startSize.width + (e.clientX - startPosition.x);
      let newHeight = startSize.height + (e.clientY - startPosition.y);

      // Limit resizing within the image boundaries
      newWidth = Math.min(newWidth, imgBox.width - props.rectangle.left);
      newHeight = Math.min(newHeight, imgBox.height - props.rectangle.top);

      // Update the rectangle size
      props.update({
        ...props.rectangle,
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleDragStart = (e: {
    dataTransfer: {
      setDragImage: (
        arg0: HTMLImageElement,
        arg1: number,
        arg2: number
      ) => void;
      effectAllowed: string;
    };
    clientX: any;
    clientY: any;
  }) => {
    // Create a transparent image on the fly
    const rect = rectRef.current;
    if (rect) {
      const rectBox = rect.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rectBox.left,
        y: e.clientY - rectBox.top,
      });
    }
    const transparentImage = new Image();
    transparentImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(transparentImage, 0, 0);
    e.dataTransfer.effectAllowed = isResizing ? "nwse-resize" : "move";
  };

  const startResizing = (e: {
    stopPropagation: () => void;
    clientX: any;
    clientY: any;
  }) => {
    // e.stopPropagation(); // Prevent drag event from starting
    if (isResizing) {
      setIsResizing(false);
      return;
    }
    setIsResizing(true);
    setStartSize({
      width: props.rectangle.width,
      height: props.rectangle.height,
    });
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div
        draggable="true"
        ref={rectRef}
        onDragStart={handleDragStart}
        onDrag={handleDragEnd}
        onDragEnd={handleDragEnd}
        style={{
          width: props.rectangle.width,
          height: props.rectangle.height,
          top: props.rectangle.top,
          left: props.rectangle.left,
          background: "transparent",
          border: `3px solid ${props.rectangle.color}`,
          position: "absolute",
          cursor: "move",
        }}
        >
        <span style={{top:"-1.5em",position:"relative", color:props.rectangle.color}}>{props.rectangle.name}</span>
        <div
          style={{
            width: "10px",
            height: "10px",
            background: props.rectangle.color,
            position: "absolute",
            bottom: "0",
            right: "0",
            cursor: "nwse-resize",
          }}
          onClick={(e) => startResizing(e)}
        />
      </div>
    </>
  );
};
