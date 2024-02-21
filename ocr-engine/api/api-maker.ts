import express,{Express} from "express";
// const prometheus = require('express-prometheus-middleware');
import { ExpressController } from "./ExpressController.interface";

export class APIMaker{
    app:Express;
    controllers:ExpressController[]
    port:number
    server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse> | undefined;
    constructor(_port:number){
        this.app = express();
        this.controllers = [];
        this.port = _port
    }

    SetupControllers = (_controllers:ExpressController[]):void=>{
        this.controllers = _controllers
    }

    private _buildRoutes = ():void=>{
        for(let controller of this.controllers){
            const router = controller.buildRoutes()
            // this.app.use('/metrics', prometheus({ metricsPath: '/metrics', collectDefaultMetrics: true }));
            this.app.use(controller.path,router)
        }
    }

    LaunchAPI = async ():Promise<void> => {
        this._buildRoutes();
        this.server = this.app.listen(this.port,()=>{
            console.log(`Listening on port ${this.port}...`);            
        })
    }

    CloseAPI = ():void=>{
        if(this.server == undefined)return;
        this.server.close();
        this.server = undefined;
    }
}