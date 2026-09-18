require("dotenv").config()
const app = require('./src/app.js')
const connectToDB = require('./src/config/db.js')

const PORT = process.env.PORT || 5000

async function start() {

    await connectToDB()
    
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
}

start()