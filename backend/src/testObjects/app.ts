import { initApp } from "../init";
import express from 'express';

const app = express()
var hasInit = false;

export const getApp = async () : Promise<express.Application> => {
    if(!hasInit){
        await initApp(app)
    }
    return app
} 
