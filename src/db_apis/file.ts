import log from "../logger/logger";

export async function get_file_bucket(client: any,file_type: number) {


    let query : string = `
                select bucket_name from ref.file_Type where id = $1    
                            `
    let values = [file_type]
    try {
        let {rows : data} = await client.query(query,values)
        return data[0].bucket_name ||null


    } catch (error) {
        log.debug(query)
        log.debug(values)
        log.error(error)

    }
}

export async function post_file_db(client: any,bind:any) {
    log.debug(JSON.stringify(bind))
    const {
        file_type,
        fileName
    } = bind 
    let query : string = `
        insert into app.file (name,file_type_id) values ($1,$2) 
    `
    let values = [query,[file_type,fileName]]
    try {
        let {rows : data} = await client.query(query,values)
        return data[0].id 


    } catch (error) {
        log.error(error)

    }
}
export async function post_object_file_db(client: any,bind:any) {

    const {
        id,
        file_id
    } = bind 
    let query : string = `
        insert into app.object_file (object_id, file_id) values ($1,$2) 
    `
    let values = [query,[id,file_id]]
    try {
        let {rows : data} = await client.query(query,values)
        return data[0].id 


    } catch (error) {
        log.error(error)

    }
}


export async function object_file_get_db(client: any,bind:any) {

    const {
        id,
        file_type
    } = bind 
    let query : string = `
        select f.id as file_id,f.name, ft.bucket_name as file_name from 
                app.object_file of 
                join hr.file f 
                join ref.file_Type ft on ft.id = f.file_type_id
                on f.id = of.file_id
                where of.object_id = $1
                and f.file_Type_id = $2

    `
    let values = [query,[id,file_type]]
    try {
        let {rows : data} = await client.query(query,values)
        return data[0]|| null


    } catch (error) {
        log.error(error)

    }
}