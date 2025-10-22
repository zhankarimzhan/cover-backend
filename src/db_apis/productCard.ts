import { Client } from "pg";
import log from "../logger/logger";

interface procuctTypeCreate {
    name : string
}
interface productCardCreate {
    name : string,
    description : string,
    create_user_id : string,
    product_type_id : number,
    current_price : number

}

interface productCardUpdate {
    name : string,
    description : string,
    create_user_id : string,
    product_type_id : number,
    current_price : number,
    update_user_id : number,
    id : number

}

export async function product_type_create_db(bind: procuctTypeCreate, client: Client) {
    let query = "";
    let values: any[] = [];

    try {
        query = `
            insert into ref.product_type (name)  values ($1)  
        `;

        values.push(bind.name);
        
        const result = await client.query(query, values);
        return result.rows[0];

    } catch (error) {
        log.error(`SQL ERROR =>
                    ${query}
                    ${values}`);
        throw error;
    }
}



export async function product_card_create_db(bind: productCardCreate, client: Client) {
    let query = "";
    let values: any[] = [];

    try {
        query = `
            INSERT INTO app.product_card 
                (name, description, create_user_id, product_type_id, current_price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, description, product_type_id, current_price, create_date
        `;

        values.push(bind.name);
        values.push(bind.description);
        values.push(bind.create_user_id);
        values.push(bind.product_type_id);
        values.push(bind.current_price);

        const result = await client.query(query, values);
        return result.rows[0];

    } catch (error) {
        log.error(`SQL ERROR =>
                    ${query}
                    ${values}`);
        throw error;
    }
}
export async function product_card_update_db(bind: productCardUpdate, client: Client) {
    let query = "";
    let values: any[] = [];
    let setParts: string[] = [];
    let index = 1;

    try {
        // Проверяем и добавляем каждое поле, если оно передано
        if (bind.name !== undefined) {
            setParts.push(`name = $${index}`);
            values.push(bind.name);
            index++;
        }

        if (bind.description !== undefined) {
            setParts.push(`description = $${index}`);
            values.push(bind.description);
            index++;
        }

        if (bind.product_type_id !== undefined) {
            setParts.push(`product_type_id = $${index}`);
            values.push(bind.product_type_id);
            index++;
        }

        if (bind.current_price !== undefined) {
            setParts.push(`current_price = $${index}`);
            values.push(bind.current_price);
            index++;
        }

        // Если есть аудит
        setParts.push(`update_user_id = $${index}`);
        values.push(bind.update_user_id);
        index++;

        setParts.push(`update_date = NOW()`);

        // Финальный SQL
        query = `
            UPDATE app.product_card
            SET ${setParts.join(', ')}
            WHERE id = $${index}
            RETURNING id, name, description, product_type_id, current_price, update_date
        `;
        values.push(bind.id);

        const result = await client.query(query, values);
        log.debug(result)
        return result.rows[0];

    } catch (error) {
        log.error(`SQL ERROR =>
                    ${query}
                    ${values}`);
        throw error;
    }
}
export async function product_card_get_db(bind: any, client: Client) {
    let query = "";
    let values: any[] = [];
    let where = `
    `
    try {
        if(bind.id) {
            where += ` and pc.id = $${values.push(bind.id)}`
        }
        if(bind.create_user_id){
            where += `and u.id = $${values.push(bind.create_user_id)}`
        }
        

        query = `
           select  
            pc.id,
            pc.description,
            pc.create_user_id,
            u.username,
            pc.current_price,
            pt."name" as product_type,
            pt.id as product_type_id,
            pc.create_date
            from app.product_card pc 
            left join  ref.product_type pt  on pt.id = pc.product_type_id 
            left join hr."user" u  on u.id = pc.create_user_id 
            where true ${where}
            order by create_date  desc 
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

export async function product_card_history_post_db (bind : any, client: any) {
    const { id, name, product_type_id, current_price } = bind;

      // Формируем динамический UPDATE (только изменённые поля)
        let query = `UPDATE app.product_card SET `;
        let values: any[] = [];
        let counter = 1;

        if (name !== undefined) {
            query += `name = $${counter++}, `;
            values.push(name);
        }
        if (product_type_id !== undefined) {
            query += `product_type_id = $${counter++}, `;
            values.push(product_type_id);
        }
        if (current_price !== undefined) {
            query += `current_price = $${counter++}, `;
            values.push(current_price);
        }

        // Убираем последнюю запятую
        query = query.slice(0, -2);
        query += ` WHERE id = $${counter} RETURNING *`;
        values.push(id);
        try {
        const updated = await client.query(query, values);
        return updated
        }catch (error){
            log.error(error)
        }
}