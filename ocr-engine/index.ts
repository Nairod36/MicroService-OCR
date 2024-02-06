import { APIMaker } from "./api";
import { RecognizeController, RecognizeFromIdController } from "./controllers";
import { config } from "dotenv";
import { IComplexRecognition } from "./ocr/models";
config()
let port:number;

if(process.env.REACT_APP_OCR_ENGINE_PORT === undefined){
    port = 3000;
}else{
    port = parseInt(process.env.REACT_APP_OCR_ENGINE_PORT,10)
}

const api = new APIMaker(port)
api.SetupControllers([RecognizeController.getInstance(),RecognizeFromIdController.getInstance()])
api.LaunchAPI()