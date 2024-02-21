import { SideElement } from "./SideElement";
import { Button } from "./ui/button";
import { IRect } from "./Main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faMagnifyingGlass, faParagraph } from "@fortawesome/free-solid-svg-icons";


export interface ISidebarEntry{
    rectangles:IRect[]
    colors:string[]
    active:boolean
    imgLoaded:boolean
    handleAdd:()=>void
    updateRect:(rectangle:IRect)=>void
    handleRecognize:()=>void
    handleFulltext:()=>void
    handleDestruct:()=>void
    checkName:(name:string)=>string
}

export const Sidebar = (props:ISidebarEntry) => {

  return (
    <div className="flex h-full w-[240px] border-l">
      <div className="flex h-full items-start w-full">
        <nav className="flex-1 grid items-start gap-1 p-2 text-sm font-medium">
          {props.rectangles.map((r) => (
            <SideElement colors={props.colors} checkName={props.checkName} key={r.id} rectangle={r} updateRect={props.updateRect} />
          ))}
          <Button
          disabled={!props.active}
            onClick={props.handleAdd}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            variant="outline"
          >
            Add Item <FontAwesomeIcon icon={faCirclePlus}/>
          </Button>
          {props.rectangles.length > 0 ?
          <Button
            disabled={!props.active}
            onClick={props.handleRecognize}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            variant="outline"
          >
            Recognize <FontAwesomeIcon icon={faMagnifyingGlass}/>
          </Button>
          :
          <></>}
          <Button
            disabled={!props.active}
            onClick={props.handleFulltext}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            variant="outline"
          >
            Fulltext <FontAwesomeIcon icon={faParagraph}/>
          </Button>
          <Button
          disabled={!props.imgLoaded}
          onClick={props.handleDestruct}
          variant="destructive"
          >
            Delete
          </Button>
        </nav>
      </div>
    </div>
  );
};

