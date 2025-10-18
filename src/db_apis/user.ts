import log from "../logger/logger";

export async function registerDB(bind: any,client:any) {
    log.debug(JSON.stringify(bind))
    let query = `
    insert into hr.user (username,password,uuid) values ($1,$2,$3)
    `
    let values = [bind.username, bind.password,bind.uuid]
    try {
        let {rows:data} = await client.query(query, values)
        return data
    }
    catch (error){
        log.error(error)
        log.debug(query)
        log.debug(values)
        throw error
    }
}
export async function getUserDB(bind: any,client:any) {
    log.debug(JSON.stringify(bind))
    let values = []

    let whereClause = ''
    let query = `
        select * from hr.user where true
    `
    if(bind.username) {
        whereClause+= `and username = $${values.push(bind.username)}`
    }
    if(bind.id){
        whereClause+= `and id = $${values.push(bind.id)}`
    }
    try {
        let {rows: data} = await client.query(`${query} ${whereClause}`, values)
        return data[0]
    }
    catch (error){
        log.error(error)
        log.debug(query)
        log.debug(values)
        throw error
        
    }
}
