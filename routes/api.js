const express = require('express')
const router = express.Router()
var cors = require('cors')

const db = require('../model/config')

router.use(cors())

// Routes setup

router.get('/', (req, res) => {
    console.log("Someone has come into the server.")
    res.send("Server is up and running smoothly")
})

router.get('/clients', function (req, res) {

    let clientsFromDB = []
    db.collection('clients').get()
        .then(clients => {
            clients.docs.forEach(doc => {
                clientData = doc.data()
                let isARelevantClient = checkDate(clientData.firstContact.slice(0, 10))
                if (isARelevantClient) { clientsFromDB.push(clientData) }
            })
            console.log("got Clients from db")
            res.send(clientsFromDB)
        })
        .catch(error => { console.log(error) })

})

router.post('/client', (req, res) => {
    const clientInfo = req.body

    db.collection('clients').add(clientInfo)
        .then(function (docRef) {
            docRef.update({
                _id: docRef.id
            })
                .then(() => {
                    console.log("Document written with ID: ", docRef.id);
                })
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        })

    res.send("just added a new client to the db")
})

router.put('/client/:id', (req, res) => {
    const clientInfo = req.body
    const clientId = req.params.id

    db.collection('clients').doc(clientId).update(clientInfo)
        .then(() => {
            console.log(" Updated document with ID: ", clientId)
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        })

    res.send("just updated a client with id", clientId)
})


router.get('/salesBy/:category', function (req, res) {
    const category = req.params.category
    let salesByCategory = {}
    db.collection('salesBy' + category).get()
        .then(categoryNames => {
            categoryNames.docs.forEach(doc => {
                salesByCategory[doc.id] = doc.data()
            })
            console.log("Got sales by " + category + " from db")
            res.send(salesByCategory)
        })
        .catch(error => { console.log(error) })
})

router.get('/salesSince/:year/:month', function (req, res) {
    const year = req.params.year
    const month = req.params.month
    console.log(year, month)
    const monthsArray = []
    db.doc(`salesByMonth/${year}/months/${month}`).get()
        .then(salesData => {
            console.log(salesData.data())
            let info = salesData.data()
            info.year = year
            console.log("Got SalesSince from db")
            res.send(info)
        })
        .catch(error => {
            console.log(error)
            console.log("No such date in SalesSince from db")
            res.send({ clients: 0, name: month, sales: 0, year: year })
        })
})

// router.get('/salesSince', function (req,res) {
//     const monthsArray = pastSixMonths()
//     console.log(monthsArray)
//     let salesSince = []
//     monthsArray.forEach(date => {
//         month = date.month
//         year = (date.year).toString()
//         db.doc(`salesByMonth/${year}/months/${month}`).get()
//         .then(salesData => {
//             const sales = salesData.data()//.sales
//             salesSince.push(sales)//({name: month, sales : sales})
//             // res.send(salesSince)  
//         })
//         .catch(error=>{ console.log(error)})
//     })
//     console.log("Got SalesSince from db")
//     res.send(salesSince)  
// })

// function pastSixMonths () {
//     const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     var now = new Date()
//     let monthsArray=[{month: shortMonths[now.getMonth()], year: now.getYear() + 1900}]
//       for (let i=0; i<5 ; i++){
//         now.setDate(now.getDate()-30)
//         monthsArray.push({month: shortMonths[now.getMonth()], year: now.getYear() + 1900})
//       }
//     return monthsArray
// }

function checkDate(date) {
    let now = new Date()
    let contactDate = new Date(date)
    if (contactDate < now) {
        return true
    }
    return false
}


module.exports = router
