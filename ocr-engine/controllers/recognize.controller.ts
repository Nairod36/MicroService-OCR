import express, { Request, Response, Router } from "express";
import { Engine } from "../ocr";
import { config } from "dotenv";
import * as fs from 'fs'
import { ExpressController } from "../api";
import { IComplexRecognition, IRecognition } from "../ocr/models";
import { IInput } from "../models";
config()

export class RecognizeController implements ExpressController{  

    readonly path: string;
    public static instance?:RecognizeController
    engine:Engine

    private constructor(){
        this.path = "/recognize";
        this.engine = new Engine();
    }
    
    public static getInstance():RecognizeController{
        if(this.instance === undefined){
            this.instance = new RecognizeController();
        }
        return this.instance;
    }

    async getBasic(req:Request,res:Response):Promise<void>{
        res.json("no content")
    }
    
    async getReco(req: Request, res: Response): Promise<void> {
        const path: string = req.params['path'];
        const fullPath: string = `${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/images/${path}`;
        console.log(fullPath);
     
        await this.engine.Setup();
        const result: IRecognition = await this.engine.Recognize(fullPath);
        await this.engine.Terminate();
        res.json(result);
    }   
    
    async getRecoComplex(req: Request, res: Response): Promise<void> {  
        const path: string = req.params['path'];
        const fullPath: string = `${process.env.SAVE_IMG_URI}:${process.env.SAVE_IMG_PORT}/image/${path}`;
        console.log(fullPath);
        const input:IInput = req.body

        const result:IComplexRecognition[] = []

        await this.engine.Setup();
        
        for (let i = 0; i < input.inputs.length; i++) {
            const entry: IRecognition = await this.engine.RecognizeComplex(`${process.env.SAVE_IMG_URI}:${process.env.SAVE_IMG_PORT}/images/${path}`, input.inputs[i].rectangle);
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
        await this.engine.Terminate();
        
        res.json(result)
    }  

    buildRoutes(): Router {
        const router = express.Router();        
        router.get('/', this.getBasic.bind(this));
        router.get('/:path', this.getReco.bind(this));
        router.post('/:path',express.json(), this.getRecoComplex.bind(this));
        return router;
    }
}