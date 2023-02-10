const { initializeApp } = require("firebase/app");
const { getDatabase} = require("firebase/database");

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
    apiKey: "AIzaSyBJU-RR2MKhO9SgWaQMAwa2A2yU6_QKwLc",
    authDomain: "iot-datastream-tu2142.firebaseapp.com",
    // databaseURL: "https://iot-datastream-tu2142-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot-datastream-tu2142",
    storageBucket: "iot-datastream-tu2142.appspot.com",
    messagingSenderId: "231851759724",
    appId: "1:231851759724:web:0273a32b2d1246d44f6049",
  // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://iot-datastream-tu2142-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

module.exports = database;