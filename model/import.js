const db = require('./config.js');
const analytics = require('../../data/analytics')
const data = analytics.updatedData()

// Clients JSON To Firestore

const jsonToFirestore = (client) => {
    db.collection('clients').add(client)
    .then(function(docRef) {
        docRef.update({
            _id : docRef.id
        })
        .then( () => {
            console.log("Document written with ID: ", docRef.id);
        })
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    })
}

data.forEach(client => {
    setTimeout(() => {
        jsonToFirestore(client)
    }, 100);
})

// ANALYTICS
const salesByCategory = function(category, salesByCategoryArray){
    if (category === "month"){
        salesByCategoryArray.forEach( yearInfo =>{
            let year = Object.keys(yearInfo)[0]
            let yearData = yearInfo[year]
            yearData.forEach( monthInfo => {
                let month = Object.keys(monthInfo)[0]
                let monthData =  monthInfo[month]
                db.doc(`salesByMonth/${year}/months/${month}`).set({
                    name: month,
                    clients: monthData.clients,
                    sales: monthData.sales,
                })
                .then( ()=> {
                    console.log("Sales By Category", category ,"successfully added to DB")
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                })
            })
        })
    }

    else{
        salesByCategoryArray.forEach( categoryInfo =>{
            name = Object.keys(categoryInfo)[0]
            let info = categoryInfo[name]
            docRef = name.toLowerCase()
            CapitalizedCategory = category[0].toUpperCase() + category.slice(1)
            db.collection('salesBy' + CapitalizedCategory).doc(`${docRef}`).set({
                name: info.name,
                clients: info.clients,
                sales: info.sales,
            })
            .then( ()=> {
                console.log("Sales By Category", category ,"successfully added to DB")
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            })
        })
    }
}

const analyticsToFb = () => {
    //salesByCategory
    const categories = ["month"] //"country", "owner" ,"emailType" , 
    categories.forEach( async(category) => {
        let salesByCategoryArray = await analytics.salesByCategory(data, category)
        salesByCategory(category, salesByCategoryArray)
    })
}

// analyticsToFb()