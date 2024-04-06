const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 8000 

const app = express()

const AuthRoute = require('./routes/authRoute')

app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.use(cors())

app.use('/auth', AuthRoute)


app.listen(port, () => console.log(`running at ${port}`))

  