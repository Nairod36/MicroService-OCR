import express, { Request, Response, Router } from "express";
import { Engine } from "../ocr";
import { config } from "dotenv";
import * as fs from 'fs'
import { ExpressController } from "../api";
import { IRecognition } from "../ocr/models";
import axios from "axios";
import { IFile } from "../models";
config()

export class RecognizeFromIdController implements ExpressController{  

    readonly path: string;
    public static instance?:RecognizeFromIdController
    engine:Engine

    private constructor(){
        this.path = "/recognizeFromId";
        this.engine = new Engine();
    }
    
    public static getInstance():RecognizeFromIdController{
        if(this.instance === undefined){
            this.instance = new RecognizeFromIdController();
        }
        return this.instance;
    }

    async getBasic(req:Request,res:Response):Promise<void>{
        res.json("no content")
    }
    
    async getReco(req: Request, res: Response): Promise<void> {
        const id: string = req.params['id'];
        const fullPath: string = `${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/image/${id}`;
        console.log(fullPath);
        const response = await axios.get(fullPath)
        const file:IFile = response.data
        
     
        await this.engine.Setup();
        // const result: IRecognition = await this.engine.Recognize(`${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/images/test.png`);
        const result: IRecognition = await this.engine.Recognize(`${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/images/${file.Path}`);
        file.ExctractData = result.content;
        const response2 = await axios.patch(`${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/image/${id}`,file)
        await this.engine.Terminate();
        
        res.json(response.data)
     }

    buildRoutes(): Router {
        const router = express.Router();        
        router.get('/', this.getBasic.bind(this));
        router.get('/:id', this.getReco.bind(this));
        return router;
    }
}