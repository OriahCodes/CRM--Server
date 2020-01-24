const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
let api = require('./routes/api')

const app = express()
// app.use(express.static(path.join(__dirname, './client/build')))
// app.use(express.static(path.join(__dirname, './client/node_modules')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', api)

// app.get('*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
//========================================================

const port = 4000
app.listen(process.env.PORT || port, function () {
    console.log(`Running server on port ${port}`)
})