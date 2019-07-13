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
  var currentUser = null;
  var dbState;
  var tempUserName;

  database.ref().once("value", function(snapshot){
    dbState = snapshot;
});

$("#new-user-btn").on("click", function() {
  tempUserName = $("#new-user-input").val().toUpperCase().trim();
  if (!dbState.child("/" + tempUserName).exists()) {
    hideArea();
  currentUser = database.ref("/" +tempUserName );
  currentUser.set({
      username : $("#new-user-input").val().trim()
  });
  } else alert('Username Already Exists');
});

$("#existing-user-btn").on("click", function() {
  tempUserName = $("#existing-user-input").val().toUpperCase().trim();
  if (dbState.child("/" + tempUserName).exists()) {
    hideArea()
      currentUser = database.ref("/" + tempUserName);
      console.log('you are "logged in"');
  }
});

//   Food2Fork API Key (Main): 6c25094e2b7ba0e57995415ce749ed94
//   Second Test API Key: b11d8301b0ecfac319569f557e520e48
var key = "4fd67c41f3d8810dc0255a68010ca17d"


// Food2Fork Search API Call

$("#recipe-search-btn").on("click", function() {
    event.preventDefault();

    searchTerm = $("#recipe-search").val();
    var queryURL = "https://www.food2fork.com/api/search?key=" + key + "&q=" + searchTerm;

    $.ajax({
        url: queryURL,
        method: "GET"
      })
      .then(function(response) {
        displayRecipes(response);
      })

})

// Displays the recipes the user is searching for.
function displayRecipes(response) {
  var results = JSON.parse(response);

  $(".recipe-search-container").removeClass("hidden");
  recipeCount = results.count;
  newRecipes = results.recipes;
  for (i = 0; i < recipeCount; i ++) {
    newDiv = $("<div>")
    .attr("id", newRecipes[i].recipe_id)
    .addClass("card")
    newP = newRecipes[i].title;
    newSourceURL = newRecipes[i].source_url;
    newImage = $("<img>")
    .attr("src", newRecipes[i].image_url)
    .addClass("card-img-top")
    .attr("alt", "an image of the cooked recipe")
    divBody = $("<div>")
    .addClass("card-body");
    cardTitle = $("<h5>")
    .addClass("card-title")
    .text(newRecipes[i].title);
    sourceLink = $("<a>")
    .attr("href", newSourceURL)
    .attr("target", "_blank")
    .text(newSourceURL);
    cardText = $("<p>")
    .addClass("card-text")
    .prepend("Source URL: ")
    .append(sourceLink);
    newButton = $("<button>")
    .attr("id", newRecipes[i].recipe_id)
    .attr("recipe-name", newRecipes[i].title)
    .addClass("recipe-btn btn btn-primary")
    .attr("data-toggle", "modal")
    .attr("data-target", "#recipeModal")
    .text("Click here to see the recipe");
    newDiv.append(newImage, divBody);
    divBody.append(cardTitle, cardText, newButton)
    $("#recipe-search-wrapper").append(newDiv);
  }
}

// Retrieves the ingredient information of a single recipe.
function retrieveSingleRecipe() {
  event.preventDefault();
  recipeID = $(this).attr("id");
  recipeTitle = $(this).attr("recipe-name");
  $("#ingredient-modal-title").empty();
  $("#ingredient-modal-title").text(recipeTitle);
  queryURL = "https://www.food2fork.com/api/get?key=" + key + "&rId=" + recipeID;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
  .then(function(response) {
    displaySingleRecipe(response)

  })
}

// Displays a single recipe's ingredients in a modal window.
function displaySingleRecipe(response) {
  var results = JSON.parse(response);
  // recipeIngredients is an array. We will need to send this information to Edamam for nutritional information.
  recipeIngredients = results.recipe.ingredients;
  $("#ingredient-modal-body").empty();
  for( i = 0 ; i < recipeIngredients.length; i++) {
    newP = $("<p>").text(recipeIngredients[i])
    $("#ingredient-modal-body").append(newP);
  }

//Added call to display calorie data   
displayCaloriesJSON (recipeIngredients,results.recipe.title);

}

function hideArea() {
  event.preventDefault();
 $(".landing-container").addClass("d-none");
 $(".recipe-area-container").removeClass("hidden");
}





  // Testing firebase
  $(document).ready(function() {

    // this function allows the page to smoothly scroll to whichever
// id or class you call it from.
$.fn.scrollView = function () {
  return this.each(function () {
      $('html, body').animate({
          scrollTop: $(this).offset().top
      }, 1000);
  });
}

$("#recipe-search-btn").on("click", function() {
  $(".recipe-search-container").scrollView();
})
    database.ref().push({
        username: name,
    });
  })

  $(document).on("click", ".recipe-btn", retrieveSingleRecipe);
  // $(document).on("click", "#new-user-btn", hideArea);
  // $(document).on("click", "#existing-user-btn", hideArea);




//Retrieve Nutrition Data for single ingredient
 function displayCaloriesJSON (recipeIngredients,title){
  
  var data = {
    title: title,
    ingr: recipeIngredients
  } 

var  url = 'https://api.edamam.com/api/nutrition-details?app_id=fca693b2&app_key=d8f84042894a6b3d6e6e9be1aef536b4'
   $.ajax({
      'type': 'POST',
      'url': url,
      'contentType': 'application/json',
      'data': JSON.stringify(data),
      'dataType': 'json',
      'success': function(data) {
        console.log(data);
      // var NutritionalData =  $("<table>");
      // NutritionalData.attr("class", "table");
      // NutritionalData.append("");
      displayNutrition(data);
    },
    'error': function(data) {

      console.log("Nothing!!!")

    },
  });
}



function displayNutrition (data) {

console.log(data);

  var result = {
 
    yield: data.yield  ? data.yield: 0 ,
    calories: data.calories  ? data.calories: 0 ,
    categories: {
    fat: {
      label: "Fat",
      totalNutrients:
        data.totalNutrients.FAT.quantity  ? data.totalNutrients.FAT.quantity : 0,
      totalDaily:
        data.totalDaily.FAT.totalDaily  ? data.totalDaily.FAT.quantity : 0,
        subcategory: 0
    },
    FASAT: {
      label: "Saturated",
      totalNutrients:
        data.totalNutrients.FASAT.quantity  ? data.totalNutrients.FASAT.quantity : 0,
      totalDaily:
        data.totalDaily.FASAT ? data.totalDaily.FASAT.quantity : 0,
        subcategory: 1
    },
    FATRN: {
      label: "Trans Fat",
      totalNutrients:
        data.totalNutrients.FATRN.quantity  ? data.totalNutrients.FATRN.quantity : 0,
      totalDaily:
        data.totalDaily.FATRN  ? data.totalDaily.FATRN.quantity : 0,
        subcategory: 1
    },
    FAMS: {
      label: "Monounsaturated",
      totalNutrients:
        data.totalNutrients.FAMS.quantity  ? data.totalNutrients.FAMS.quantity : 0,
      totalDaily:
        data.totalDaily.FAMS ? data.totalDaily.FAMS.quantity : 0,
        subcategory: 1
    },
    FAPU: {
      label: "Polyunsaturated",
      totalNutrients:
        data.totalNutrients.FAMS.quantity  ? data.totalNutrients.FAMS.quantity : 0,
      totalDaily:
        data.totalDaily.FAMS  ? data.totalDaily.FAMS.quantity : 0,
        subcategory: 1
    },
    carbs: {
      label: "Carbohydrate",
      totalNutrients:
        data.totalNutrients.CHOCDF.quantity  ? data.totalNutrients.CHOCDF.quantity : 0,
      totalDaily:
        data.totalDaily.CHOCDF  ? data.totalDaily.CHOCDF.quantity : 0,
        subcategory: 0
    },
    SUGAR: {
      label: "Sugars",
      totalNutrients:
        data.totalNutrients.SUGAR.quantity  ? data.totalNutrients.SUGAR.quantity : 0,
      totalDaily:
        data.totalDaily.SUGAR  ? data.totalDaily.SUGAR.quantity : 0,
        subcategory: 1
    },
    FIBTG: {
      label: "Fibre",
      totalNutrients:
        data.totalNutrients.FIBTG.quantity  ? data.totalNutrients.FIBTG.quantity : 0,
      totalDaily:
        data.totalDaily.FIBTG  ? data.totalDaily.FIBTG.quantity : 0,
        subcategory: 1
    },
    NA: {
      label: "Sodium",
      totalNutrients:
        data.totalNutrients.NA.quantity  ? data.totalNutrients.NA.quantity : 0,
      totalDaily:
        data.totalDaily.NA  ? data.totalDaily.NA.quantity : 0,
        subcategory: 0
    },
    CHOLE: {
      label: "Cholestrol",
      totalNutrients:
        data.totalNutrients.CHOLE.quantity  ? data.totalNutrients.CHOLE.quantity : 0,
      totalDaily:
        data.totalDaily.CHOLE  ? data.totalDaily.CHOLE.quantity : 0,
        subcategory: 0
    },
    PROCNT: {
      label: "Protein",
      totalNutrients:
        data.totalNutrients.PROCNT.quantity  ? data.totalNutrients.PROCNT.quantity : 0,
      totalDaily:
        data.totalDaily.PROCNT  ? data.totalDaily.PROCNT.quantity : 0,
        subcategory: 0
    }
    }

  };

  
  var tableBody = $("<tbody>").append(); 
  var nutritionalTable = $("<table>").append(tableBody);
  nutritionalTable.attr("id","nutitritionTable") 
  .attr("class", "table-responsive table-bordered table-hover")

   yieldDisplay=   $("<h3>").html('<th colspan="3"> Servings :' + result.yield + "</th>");
     calDisplay=   $("<h3>").html('<th colspan="3"> Calories:' + result.calories + "</th>");  

  for (let key in result.categories) {

    let value = result.categories[key];
    console.log(key, value);

    if(key.subcategory === 0){

    var newRow = $("<tr>")
      .html('<th colspan="3"> <b>' + value.label + '</b>  '
        + Math.round(value.totalNutrients)
        + '</th> <td>'
        + Math.round(value.totalDaily) +'%'+ '</td>');
     newRow.addClass("Main-Category");   
     
    }

    else{
      
    var newRow = $("<tr>")
    .html('<th colspan="3">' + value.label + '  '
      + Math.round(value.totalNutrients)
      + '</th> <td>'
      + Math.round(value.totalDaily) +'%'+ '</td>');
      newRow.addClass("Sub-Category"); 
    }
    nutritionalTable.append(newRow);
    
  }

  $("#nutrition-modal-body").append(yieldDisplay, calDisplay, nutritionalTable);
  


}

