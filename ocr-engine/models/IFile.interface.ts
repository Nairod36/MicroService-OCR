import { IComplexRecognition, IRecognitionResult } from "../ocr/models";

export interface IFile{
    ID: string;
    IdUser : string;
    Name: string;
    Path: string;
    ContentType: string;
    Fulltext: string;
    Recognition: IComplexRecognition[]
}