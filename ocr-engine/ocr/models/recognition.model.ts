export interface IRecognition{
    imagePath:string;
    fulltext:string;
}
export interface IRecognitionResult{
    recognition:IComplexRecognition[]
}
export interface IComplexRecognition{
    [key:string]:IComplexElement
}
export interface IComplexElement{
    value:string
    left:number
    top:number
    width:number
    height:number
}