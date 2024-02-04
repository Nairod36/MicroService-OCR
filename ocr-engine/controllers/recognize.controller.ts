import express, { Request, Response, Router } from "express";
import { Engine } from "../ocr";
import { config } from "dotenv";
import * as fs from 'fs'
import { ExpressController } from "../api";
import { IRecognition } from "../ocr/models";
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
        const fullPath: string = `${process.env.IMAGES_PATH}${path}`;
        console.log(fullPath);
        
     
        if (!fs.existsSync(fullPath)) {
           res.status(404).send('File not found');
           return;
        }
     
        await this.engine.Setup();
        const result: IRecognition = await this.engine.Recognize(fullPath);
        await this.engine.Terminate();
        res.json(result);
     }

    buildRoutes(): Router {
        const router = express.Router();        
        router.get('/', this.getBasic.bind(this));
        router.get('/:path', this.getReco.bind(this));
        return router;
    }
}