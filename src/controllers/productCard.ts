import { HttpStatus } from "../constants/httpstatus";
import log from "../logger/logger";

import { NextFunction, Request, Response } from "express";
import { createBind } from "../utills/bind";
import getClient from "../db_apis/db";
import { product_card_create_db, product_card_get_db, product_card_put_db } from "../db_apis/productCard";
import { post_product_card_comments_db, product_card_comments_db } from "../db_apis/productCardComments";


export async function productCardPost(req: Request, res: Response, next: NextFunction) {
    let client;
    try {
        client = await getClient();
        await client.connect();
        const bind = createBind(req);
        log.debug(JSON.stringify(bind))
        const { name, product_type_id, current_price } = bind;

            if (!name || typeof name !== "string") {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: "Field 'name' is required and must be a string." });
            }

            if (!product_type_id || isNaN(Number(product_type_id))) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: "Field 'product_type_id' is required and must be a number." });
            }

            if (current_price == null || isNaN(Number(current_price))) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: "Field 'current_price' is required and must be a number." });
            }

   
        const data = await product_card_create_db(bind, client);

         const io = req.app.get("io");
        io.emit("product_created", data);

        

        res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            message: "Product card created",
            data
        });
    } catch (error: any) {
        log.error("Error in productCardController:", error);
        next(error);
    } finally {
        await client?.end();
    }
}
export async function productCardPut(req: Request, res: Response, next: NextFunction) {
    let client;
    try {
        client = await getClient();
        await client.connect();
        const bind = createBind(req);
        const { id } = req.params;   // product card ID
        if (!id || isNaN(Number(id))) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Valid 'id' is required in URL." });
        }

        // Проверка существует ли запись
        const existing = await client.query(
            `SELECT * FROM app.product_card WHERE id = $1`,
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "Product card not found." });
        }
        bind.old_price = existing.rows[0].current_price
        let updated = await product_card_put_db(bind,client)
        res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            message: "Product card updated",
            data: updated.rows[0]
        });

    } catch (error: any) {
        log.error("Error in productCardPut:", error);
        next(error);
    } finally {
        await client?.end();
    }
}

export async function productCardGet(req: Request, res: Response, next: NextFunction) {
    let client;
    try {
        client = await getClient();
        await client.connect();
        const bind = createBind(req);
        log.debug(JSON.stringify(bind))
        const { id } = bind;

      
   
        const data = await product_card_get_db(bind, client);

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
export async function productCardCommentsGet(req: Request, res: Response, next: NextFunction) {
    let client;
    try {
        client = await getClient();
        await client.connect();
        const bind = createBind(req);
        const data = await product_card_comments_db(bind, client);
        res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            message: "Product data",
            data
        });
    } catch (error: any) {
        log.error("Error in productCardCommentsGet:", error);
        next(error);
    } finally {
        await client?.end();
    }
}
export async function productCardCommentsPost(req: Request, res: Response, next: NextFunction) {
    let client;
    try {
        client = await getClient();
        await client.connect();
        const bind = createBind(req);
        const data = await post_product_card_comments_db(bind, client);
        res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            message: "Product data",
            data
        });
    } catch (error: any) {
        log.error("Error in productCardCommentsPost:", error);
        next(error);
    } finally {
        await client?.end();
    }
}
