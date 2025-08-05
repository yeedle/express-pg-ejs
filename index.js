import knex from 'knex';
import { Client } from 'pg'
import { PrismaClient } from '@prisma/client';
import express from 'express'
import ejs from 'ejs'
import path from 'path'


const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING,
})

client.connect()


const pg = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
    pool: {
        min: 0,
        max: 10,
    }
  });

  const prisma = new PrismaClient()
const app = express()
app.set('views', path.join(import.meta.dirname, ''));
app.set('view engine', 'ejs');
const port = 3000


app.get('/ejs2', (req, res) => {
    res.render('index', {people: ['geddy', 'neil', 'alex'], user: {name: 'alex'}, cls: 'red'});
  });

// const where = `id = 1; drop table users;`

// const results1 = await client.query(`SELECT * FROM users WHERE id = $1`, [1])
// console.log(results1.rows)

// // sql injection
// const results = await pg.select('*').from('users').where('id', 1)
// console.log(results)

app.get('/prisma', async (req, res) => {
  const prismaResults = await prisma.users.findMany({
    where: {
        id: 1
    },
    include: {
        posts: true
    }
  })
  res.send(prismaResults)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/pg', async (req, res) => {
  const results = await pg.select('*').from('users').where('id', 1)
  res.send(results)
})

app.get('/client', async (req, res) => {
  const results = await client.query('SELECT * FROM users WHERE id = $1', [1])
  res.send(results.rows)
})



app.get('/ejs', async (req, res) => {
  const people = ['geddy', 'neil', 'alex']
  const html = ejs.render('<%= people.join(", "); %>', {people: people})
  res.send(html)
})


process.on('SIGTERM', () => {
    debug('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        pg.destroy()
        client.end()
      debug('HTTP server closed')
    })
  });