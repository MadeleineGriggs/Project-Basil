  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDLGabsANQ8jKELPND_EQun-VAOGjD5R-c",
    authDomain: "project-basil-db62e.firebaseapp.com",
    databaseURL: "https://project-basil-db62e.firebaseio.com",
    projectId: "project-basil-db62e",
    storageBucket: "",
    messagingSenderId: "107913695337",
    appId: "1:107913695337:web:323e2e145c63685e"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();




//   Food2Fork API Key: 6c25094e2b7ba0e57995415ce749ed94

var searchTerm = "chicken"
var queryURL = "https://www.food2fork.com/api/search?key=6c25094e2b7ba0e57995415ce749ed94&q=" + searchTerm;

$.ajax({
    url: queryURL,
    method: "GET"
  })
  .then(function(response) {
      var results = response;
      console.log(JSON.stringify(results))
  })

  $(document).ready(function() {
    var name = "Let's see if that works.";
    database.ref().push({
        username: name,
    });
  })