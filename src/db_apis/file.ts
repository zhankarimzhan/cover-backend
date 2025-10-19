import { Client as MinioClient } from 'minio';
import { NextFunction, Request, Response } from "express";
import getClient from './db';
import { createBind } from '../utills/bind';
import log from '../logger/logger';
import { HttpStatus } from '../constants/httpstatus';


const minioClient = new MinioClient({
  endPoint: process.env.FILE_END_POINT || 'localhost',
  port: parseInt(process.env.FILE_PORT || '9000'),
  useSSL: false,
  accessKey: process.env.FILE_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.FILE_SECRET_KEY || 'minioadmin123',
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
        let  { id } = bind;
        let {rows : bucket_name }= await client.query(`select bucket_name from ref.file_Type where id = ${id}`)
        
        bucket_name = bucket_name[0].bucket_name
        log.debug(bucket_name)
        log.debug(JSON.stringify(req.file))
        if (!req.file) {
    throw {
        code: HttpStatus.BAD_REQUEST,
        message: "Файл не найден. Используй form-data с ключом 'file'"
    };
}

        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;

        let bucketName : any = bucket_name
    
        await minioClient.putObject(
            'user',
            fileName,
            fileBuffer
        );


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