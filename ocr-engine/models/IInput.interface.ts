export interface IInput{
    inputs:IInputComponent[]
}

export interface IInputComponent{
    name:string
    rectangle:IRectangle
}

export interface IRectangle{
    left:number
    top:number
    width:number
    height:number        
}