import { Client as MinioClient } from 'minio';
import { NextFunction, Request, Response } from "express";
import getClient from './db';
import { createBind } from '../utills/bind';
import log from '../logger/logger';
import { HttpStatus } from '../constants/httpstatus';


const minioClient = new MinioClient({
  endPoint: process.env.FILE_END_POINT ?? '',
  port: parseInt(process.env.FILE_PORT ?? '9000'),
  accessKey: process.env.FILE_ACCESS_KEY ?? '',
  secretKey: process.env.FILE_SECRET_KEY ?? '',
});

export async function filePost(req: Request, res: Response, next: NextFunction) {
    let client;
    try {
        client = await getClient();
        await client.connect();
        const bind = createBind(req);
        if(!bind.type){
            throw {
                code :HttpStatus.BAD_REQUEST,
                message : 'file type is required'
            }
        }
        if(!bind.id){
             throw {
                code :HttpStatus.BAD_REQUEST,
                message : 'id is required'
            }
        }
        const { id } = bind;
        let data = {}
        res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            message: "Product data",
            data
        });
    } catch (error: any) {
        log.error("Error in productCardController:", error);
        next(error);
    } finally {
        await client?.end();
    }
}