export interface IFile{
    ID: string;
    IdUser : string;
    Name: string;
    Path: string;
    ContentType: string;
    Fulltext: string;
    Recognition: IComplexRecognition[]
}
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