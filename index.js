'use-strict'
// import dependencies ------------------------------------------------------------
const express = require('express')
const cors = require('cors')

// initialization ------------------------------------------------------------
const app = express()

// middleware ------------------------------------------------------------
app.use(cors()) // use cors in app 
app.use(express.json()) // get only body of request from client side




// load data ------------------------------------------------------------

//// api end points ------------------------------------------------------------
// route 1: /api/ping, GET
app.get('/api/ping', async (req, res) => {
    try {

        const responsePayload = {
            'success': true
        }

        res.json(responsePayload)

    } catch (error) {
        console.log(error)

        const responsePayload = {
            'success': false
        }

        res.json(responsePayload)
    }
})

//  server listen 
app.listen(3000, '0.0.0.0', () => {
    console.log('NodeJS server started on port 3000')
})

module.exports = app