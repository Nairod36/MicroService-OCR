import { APIMaker } from "./api";
import { RecognizeController } from "./controllers";
import { config } from "dotenv";
config()
let port:number;

if(process.env.OCR_ENGINE_PORT === undefined){
    port = 3000;
}else{
    port = parseInt(process.env.OCR_ENGINE_PORT,10)
}

const api = new APIMaker(port)
api.SetupControllers([RecognizeController.getInstance()])
api.LaunchAPI()