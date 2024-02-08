import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IRect } from "./Main"
import { faCircle, faCircleXmark, faSquareCheck, faSquarePen } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select"
import { SelectValue } from "@radix-ui/react-select"



export interface ISideElement{
    rectangle:IRect
    colors:string[]
    updateRect:(rectangle:IRect)=>void
    checkName:(name:string)=>string
}

export const SideElement = (props:ISideElement) => {
  const [isEditing,setIsEditing] = useState(false)
  const [lastName,setLastName] = useState("")
  const [editedName, setEditedName] = useState("")
  const handleEditing = () => {
    setIsEditing(!isEditing)
    setLastName(props.rectangle.name)
    setEditedName(props.rectangle.name)
  }
  const handleUnediting = () => {
    setIsEditing(!isEditing)
  }
  const handleChange = (e:{target:any}) => {
    setEditedName(e.target.value)    
  }
  const handleValidate = () => {
    setLastName(editedName)   
    setIsEditing(!isEditing)
    const newRect = {...props.rectangle, name:props.checkName(editedName)} 
    props.updateRect(newRect)
  }

  const handleColorChange = (value:string) => {
    const newRect = {...props.rectangle, color:value}
      props.updateRect(newRect)      
  }
    return(        
        <div
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        {isEditing ?
          <><Input placeholder={lastName} onChange={handleChange}/><FontAwesomeIcon onClick={handleUnediting} icon={faCircleXmark}/><FontAwesomeIcon onClick={handleValidate} icon={faSquareCheck}/></>
          :
          <>{props.rectangle.name}<FontAwesomeIcon onClick={handleEditing} icon={faSquarePen} /> </>
        }
        <Select onValueChange={handleColorChange} defaultValue={props.rectangle.color}>
          <SelectTrigger className="w-[60px]">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>
            {props.colors.map((c,i)=>(
              <SelectItem key={i} value={c}><FontAwesomeIcon style={{color:c}} icon={faCircle}/></SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
}