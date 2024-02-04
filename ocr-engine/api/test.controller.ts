import { ExpressController } from ".";
import express, { Request, Response, Router } from "express";

export class TestController implements ExpressController{  

    readonly path: string;

    constructor(){
        this.path = "/test";
    }

    async getBasic(req:Request,res:Response):Promise<void>{
        res.json("no content")
    }

    buildRoutes(): Router {
        const router = express.Router();        
        router.get('/', this.getBasic.bind(this));
        return router;
    }
}