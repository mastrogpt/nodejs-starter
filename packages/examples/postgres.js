//--web true
//--kind nodejs:default
//--param POSTGRES_URL $POSTGRES_URL

const { Client } = require('pg')

async function main(args) {        
    console.log(args.postgres_url);
    const client = new Client({connectionString:args.POSTGRES_URL});

    const createTableText = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE TABLE IF NOT EXISTS nuvolaris_table (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        message varchar(100)        
    );
    `

    // Connect to database server
    await client.connect();

    response = {body: {}}

    try {
        await client.query(createTableText)
        const message = "Nuvolaris Postgres is up and running!"
        await client.query('INSERT INTO nuvolaris_table(message) VALUES($1)', [message]) 
        const { rows } = await client.query('SELECT * FROM nuvolaris_table')
        console.log(rows)        
        await client.query('DROP table nuvolaris_table');
        response.body = rows;
      } catch (e) {
        console.log(e);        
        throw e
      } finally {
        client.end();
      }

    return response;
}