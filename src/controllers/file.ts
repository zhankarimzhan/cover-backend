import { Client as MinioClient } from 'minio';
import { NextFunction, Request, Response } from "express";
import { createBind } from '../utills/bind';
import log from '../logger/logger';
import { HttpStatus } from '../constants/httpstatus';
import getClient from '../db_apis/db';
import { get_file_bucket, object_file_get_db, post_file_db, post_object_file_db } from '../db_apis/file';

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
        if(!bind.file_type){
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
        let  { id,file_type } = bind;
        let  bucket_name = await get_file_bucket(client,file_type)
        
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
        let file_id  = await post_file_db(client,{fileName, file_type})

        let bucketName : any = bucket_name
    
        await minioClient.putObject(
            bucketName,
            `${file_id}_${fileName}`,
            fileBuffer
        );

        await post_object_file_db(client,{id, file_id})

        let data = file_id
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

export async function objectFileGet(req: Request, res: Response, next: NextFunction) {
    let client
    try {
        client = await getClient()
        let bind = createBind(req)
        const {
            id, file_type
        } = bind

        let fileData =  await object_file_get_db(client,{id,file_type})

        let filedata = minioClient.getObject(fileData.bucket_name,`${fileData.file_id}_${fileData.name}`)
        return fileData
    } catch (error) {
        log.error(error)
    }
    finally {
        if(client){
            await client.end()
        }
    }
    
}