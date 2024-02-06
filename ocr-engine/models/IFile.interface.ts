import { IComplexRecognition, IRecognitionResult } from "../ocr/models";

export interface IFile{
    ID: string;
    Name: string;
    Path: string;
    ContentType: string;
    Fulltext: string;
    Recognition: IComplexRecognition[]
}