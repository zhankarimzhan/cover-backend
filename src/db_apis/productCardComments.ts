
import log from "../logger/logger";
import { Client } from "pg";

export async function product_card_comments_db(bind: any, client: Client) {
    let query = "";
    let values: any[] = [];
    let where = `
    `
    try {
        
        query = `
         select 
            pcc.id,
            pcc.user_id,
            pcc.create_date,
            pcc.message,
            u.username
            from app.product_card_comment pcc 
            left join hr.user u on u.id = pcc.user_id 
            where pcc.product_card_id   =  $${values.push(bind.id)}
           
        `;

        const {rows : result} = await client.query(query, values);
        return result;

    } catch (error) {
        log.error(`SQL ERROR =>
                    ${query}
                    ${values}`);
        throw error;
    }
}

export async function post_product_card_comments_db(bind: any, client: Client) {
    let query = "";
    let values: any[] = [];
    try {
        
        query = `
        intsert into  app.product_card_comment (user_id,message,product_card_id
         ${bind.parent_id? ",parent_id":""}
        )
        values ($${values.push(bind.user_id)},$${values.push(bind.message)},
        $${values.push(bind.id)}
        ${bind.parent_id? `,$${values.push(bind.parent_id)}`:""}
        )
        `;

        const {rows : result} = await client.query(query, values);
        return result;

    } catch (error) {
        log.error(`SQL ERROR =>
                    ${query}
                    ${values}`);
        throw error;
    }
}

