var firebase  = require('firebase')

var firebaseConfig = {
    apiKey: "AIzaSyAphBB7W8SUe_IMxp27rK0SBW7k6rWGLX8",
    authDomain: "mycrm-dc4d7.firebaseapp.com",
    databaseURL: "https://mycrm-dc4d7.firebaseio.com",
    projectId: "mycrm-dc4d7",
    storageBucket: "mycrm-dc4d7.appspot.com",
    messagingSenderId: "846157267581",
    appId: "1:846157267581:web:361fe7d924927d57d2e714"
}

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore()  

module.exports = db