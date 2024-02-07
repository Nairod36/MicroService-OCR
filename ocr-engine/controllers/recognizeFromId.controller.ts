import express, { Request, Response, Router } from "express";
import { Engine } from "../ocr";
import { config } from "dotenv";
import * as fs from 'fs'
import { ExpressController } from "../api";
import { IComplexRecognition, IRecognition } from "../ocr/models";
import axios from "axios";
import { IFile, IInput } from "../models";
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
        const result: IRecognition = await this.engine.Recognize(`${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/images/${file.Path}`);
        file.Fulltext = result.fulltext;
        const response2 = await axios.patch(`${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/image/${id}`,file)
        await this.engine.Terminate();
        
        res.json(result)
     }
    
     async getRecoComplex(req: Request, res: Response): Promise<void> {   
        const id: string = req.params['id'];
        const fullPath: string = `${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/image/${id}`;
        console.log(fullPath);
        const response = await axios.get(fullPath)
        const file:IFile = response.data            
        const input:IInput = req.body

        const result:IComplexRecognition[] = []

        await this.engine.Setup();
        
        for (let i = 0; i < input.inputs.length; i++) {
            const entry: IRecognition = await this.engine.RecognizeComplex(`${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/images/${file.Path}`, input.inputs[i].rectangle);
            const name = input.inputs[i].name
            result.push({
                [name]:{
                    value:entry.fulltext,
                    top:input.inputs[i].rectangle.top,
                    left:input.inputs[i].rectangle.left,
                    width:input.inputs[i].rectangle.width,
                    height:input.inputs[i].rectangle.height
                }
            });
        }
        file.Recognition = result
        const response2 = await axios.patch(`${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/image/${id}`,file)
        await this.engine.Terminate();
        
        res.json(result)
      }

    buildRoutes(): Router {
        const router = express.Router();        
        router.get('/', this.getBasic.bind(this));
        router.post('/:id',express.json(), this.getRecoComplex.bind(this));
        router.get('/:id', this.getReco.bind(this));
        return router;
    }
}