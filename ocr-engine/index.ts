import { APIMaker } from "./api";
import { RecognizeController } from "./controllers";
import { config } from "dotenv";
config()
let port:number;

if(process.env.PORT === undefined){
    port = 3000;
}else{
    port = parseInt(process.env.PORT,10)
}

const api = new APIMaker(port)
api.SetupControllers([RecognizeController.getInstance()])
api.LaunchAPI()