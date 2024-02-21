import { createWorker} from 'tesseract.js';
import { IRecognition } from './models';
import { IRectangle } from '../models';

export class Engine{
    worker: any;
    white_list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    Setup = async()=>{
        this.worker = await createWorker('eng')
        // await this.worker.setParameters({
        //     tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        // });
    }

    Recognize = async(imagePath:string):Promise<IRecognition>=>{
        const { data: { text } } = await this.worker.recognize(imagePath);
        const output:IRecognition = {
            imagePath,
            fulltext:text
        }
        return output;
    }

    RecognizeComplex = async(imagePath:string,rectangle:IRectangle):Promise<IRecognition>=>{
        const { data: { text } } = await this.worker.recognize(imagePath,{rectangle:rectangle});
        console.log(text);
        
        const output:IRecognition = {
            imagePath,
            fulltext:text
        }
        return output;
    }

    Terminate = async ()=>{
        await this.worker.terminate();
    }
}