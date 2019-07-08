
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDFG1iTddlpdZrJWeGTIwzDqzY1213-_WY",
    authDomain: "testing-stuff-out-3679e.firebaseapp.com",
    databaseURL: "https://testing-stuff-out-3679e.firebaseio.com",
    projectId: "testing-stuff-out-3679e",
    storageBucket: "",
    messagingSenderId: "157727410669",
    appId: "1:157727410669:web:23c24700f6f3d5dd"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var currentUser = null;
var dbState;
var tempUserName;

var response = 
{
    "count": 30,
    "recipes": [
      {
        "publisher": "My Baking Addiction",
        "f2f_url": "http://food2fork.com/view/8061c3",
        "title": "Virtual Picnic- Cheesecake in a Jar",
        "source_url": "http://www.mybakingaddiction.com/cheesecake-in-a-jar-recipe/",
        "recipe_id": "8061c3",
        "image_url": "http://static.food2fork.com/CheesecakeJars2Crop1of1eedb.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://www.mybakingaddiction.com"
      },
      {
        "publisher": "My Baking Addiction",
        "f2f_url": "http://food2fork.com/view/035865",
        "title": "The Best Chocolate Cake",
        "source_url": "http://www.mybakingaddiction.com/the-best-chocolate-cake-recipe/",
        "recipe_id": "035865",
        "image_url": "http://static.food2fork.com/BlackMagicCakeSlice1of18c68.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://www.mybakingaddiction.com"
      },
      {
        "publisher": "Closet Cooking",
        "f2f_url": "http://food2fork.com/view/35354",
        "title": "Guinness Chocolate Cheesecake",
        "source_url": "http://www.closetcooking.com/2011/03/guinness-chocolate-cheesecake.html",
        "recipe_id": "35354",
        "image_url": "http://static.food2fork.com/Guinness2BChocolate2BCheesecake2B12B5002af4b6b4.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://closetcooking.com"
      },
      {
        "publisher": "101 Cookbooks",
        "f2f_url": "http://food2fork.com/view/48088",
        "title": "How to Make Gnocchi like an Italian Grandmother",
        "source_url": "http://www.101cookbooks.com/archives/how-to-make-gnocchi-like-an-italian-grandmother-recipe.html",
        "recipe_id": "48088",
        "image_url": "http://static.food2fork.com/gnocchirecipe_07d074.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://www.101cookbooks.com"
      },
      {
        "publisher": "Simply Recipes",
        "f2f_url": "http://food2fork.com/view/36251",
        "title": "Easy Brazilian Cheese Bread",
        "source_url": "http://www.simplyrecipes.com/recipes/easy_brazilian_cheese_bread/",
        "recipe_id": "36251",
        "image_url": "http://static.food2fork.com/braziliancheesebreada300x200ffd79a7b.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://simplyrecipes.com"
      },
      {
        "publisher": "Simply Recipes",
        "f2f_url": "http://food2fork.com/view/35760",
        "title": "Banana Bread",
        "source_url": "http://www.simplyrecipes.com/recipes/banana_bread/",
        "recipe_id": "35760",
        "image_url": "http://static.food2fork.com/banana_bread300x2000a14c8c5.jpeg",
        "social_rank": 100.0,
        "publisher_url": "http://simplyrecipes.com"
      },
      {
        "publisher": "All Recipes",
        "f2f_url": "http://food2fork.com/view/2734",
        "title": "Banana Banana Bread",
        "source_url": "http://allrecipes.com/Recipe/Banana-Banana-Bread/Detail.aspx",
        "recipe_id": "2734",
        "image_url": "http://static.food2fork.com/254186ea50.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://allrecipes.com"
      },
      {
        "publisher": "All Recipes",
        "f2f_url": "http://food2fork.com/view/2803",
        "title": "Banana Crumb Muffins",
        "source_url": "http://allrecipes.com/Recipe/Banana-Crumb-Muffins/Detail.aspx",
        "recipe_id": "2803",
        "image_url": "http://static.food2fork.com/124030cedd.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://allrecipes.com"
      },
      {
        "publisher": "All Recipes",
        "f2f_url": "http://food2fork.com/view/3068",
        "title": "Basic Crepes",
        "source_url": "http://allrecipes.com/Recipe/Basic-Crepes/Detail.aspx",
        "recipe_id": "3068",
        "image_url": "http://static.food2fork.com/4005704623.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://allrecipes.com"
      },
      {
        "publisher": "All Recipes",
        "f2f_url": "http://food2fork.com/view/3620",
        "title": "Best Brownies",
        "source_url": "http://allrecipes.com/Recipe/Best-Brownies/Detail.aspx",
        "recipe_id": "3620",
        "image_url": "http://static.food2fork.com/720553ee26.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://allrecipes.com"
      },
      {
        "publisher": "Pastry Affair",
        "f2f_url": "http://food2fork.com/view/8f47af",
        "title": "Butterbeer&nbsp;Cupcakes - Home - Pastry Affair",
        "source_url": "http://www.thepastryaffair.com/blog/2011/7/14/butterbeer-cupcakes.html",
        "recipe_id": "8f47af",
        "image_url": "http://static.food2fork.com/5938769838_6872e19689_z19ed.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://www.pastryaffair.com"
      },
      {
        "publisher": "All Recipes",
        "f2f_url": "http://food2fork.com/view/4327",
        "title": "Blueberry Zucchini Bread",
        "source_url": "http://allrecipes.com/Recipe/Blueberry-Zucchini-Bread/Detail.aspx",
        "recipe_id": "4327",
        "image_url": "http://static.food2fork.com/2526289a56.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://allrecipes.com"
      },
      {
        "publisher": "All Recipes",
        "f2f_url": "http://food2fork.com/view/16553",
        "title": "Homemade Black Bean Veggie Burgers",
        "source_url": "http://allrecipes.com/Recipe/Homemade-Black-Bean-Veggie-Burgers/Detail.aspx",
        "recipe_id": "16553",
        "image_url": "http://static.food2fork.com/507107991f.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://allrecipes.com"
      },
      {
        "publisher": "All Recipes",
        "f2f_url": "http://food2fork.com/view/32478",
        "title": "The Best Rolled Sugar Cookies",
        "source_url": "http://allrecipes.com/Recipe/The-Best-Rolled-Sugar-Cookies/Detail.aspx",
        "recipe_id": "32478",
        "image_url": "http://static.food2fork.com/9956913c10.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://allrecipes.com"
      },
      {
        "publisher": "All Recipes",
        "f2f_url": "http://food2fork.com/view/32745",
        "title": "To Die For Blueberry Muffins",
        "source_url": "http://allrecipes.com/Recipe/To-Die-For-Blueberry-Muffins/Detail.aspx",
        "recipe_id": "32745",
        "image_url": "http://static.food2fork.com/6629086e7e.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://allrecipes.com"
      },
      {
        "publisher": "Cookin Canuck",
        "f2f_url": "http://food2fork.com/view/55c5af",
        "title": "Nutella & Sea Salt Stuffed Sugar Cookies",
        "source_url": "http://www.cookincanuck.com/2011/12/nutella-sea-salt-stuffed-sugar-cookie-recipe-oxo-baking-giveaway/",
        "recipe_id": "55c5af",
        "image_url": "http://static.food2fork.com/6501336017_9fc5dd5f22e8a9.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://www.cookincanuck.com"
      },
      {
        "publisher": "The Pioneer Woman",
        "f2f_url": "http://food2fork.com/view/46956",
        "title": "Deep Dish Fruit Pizza",
        "source_url": "http://thepioneerwoman.com/cooking/2012/01/fruit-pizza/",
        "recipe_id": "46956",
        "image_url": "http://static.food2fork.com/fruitpizza9a19.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://thepioneerwoman.com"
      },
      {
        "publisher": "The Pioneer Woman",
        "f2f_url": "http://food2fork.com/view/fbc7af",
        "title": "The Best Chocolate Sheet Cake. Ever.",
        "source_url": "http://thepioneerwoman.com/cooking/2007/06/the_best_chocol/",
        "recipe_id": "fbc7af",
        "image_url": "http://static.food2fork.com/388604527_5e6812454fc6f7.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://thepioneerwoman.com"
      },
      {
        "publisher": "The Pioneer Woman",
        "f2f_url": "http://food2fork.com/view/8f3e73",
        "title": "The Best Lasagna Ever",
        "source_url": "http://thepioneerwoman.com/cooking/2007/06/the_best_lasagn/",
        "recipe_id": "8f3e73",
        "image_url": "http://static.food2fork.com/387114468_aafd1be3404a2f.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://thepioneerwoman.com"
      },
      {
        "publisher": "Two Peas and Their Pod",
        "f2f_url": "http://food2fork.com/view/54439",
        "title": "Red Velvet Cheesecake Cookies",
        "source_url": "http://www.twopeasandtheirpod.com/red-velvet-cheesecake-cookies/",
        "recipe_id": "54439",
        "image_url": "http://static.food2fork.com/redvelvetcheesecakecookiesace1.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://www.twopeasandtheirpod.com"
      },
      {
        "publisher": "Elana's Pantry",
        "f2f_url": "http://food2fork.com/view/166dae",
        "title": "Paleo Pumpkin Bread",
        "source_url": "http://www.elanaspantry.com/paleo-pumpkin-bread/",
        "recipe_id": "166dae",
        "image_url": "http://static.food2fork.com/paleopumpkinbreadglutenfreegrainfreerecipe413x575b26e.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://www.elanaspantry.com"
      },
      {
        "publisher": "A Spicy Perspective",
        "f2f_url": "http://food2fork.com/view/aea246",
        "title": "Fresh Strawberry Yogurt Cake",
        "source_url": "http://www.aspicyperspective.com/2010/05/farmstand-fresh.html",
        "recipe_id": "aea246",
        "image_url": "http://static.food2fork.com/DSC05423180x1809c1b.jpg",
        "social_rank": 100.0,
        "publisher_url": "http://www.aspicyperspective.com"
      },
      {
        "publisher": "All Recipes",
        "f2f_url": "http://food2fork.com/view/10467",
        "title": "Creamy Rice Pudding",
        "source_url": "http://allrecipes.com/Recipe/Creamy-Rice-Pudding/Detail.aspx",
        "recipe_id": "10467",
        "image_url": "http://static.food2fork.com/1086813697.jpg",
        "social_rank": 99.99999999999999,
        "publisher_url": "http://allrecipes.com"
      },
      {
        "publisher": "All Recipes",
        "f2f_url": "http://food2fork.com/view/33124",
        "title": "Tres Leches Cake",
        "source_url": "http://allrecipes.com/Recipe/Tres-Leches-Milk-Cake/Detail.aspx",
        "recipe_id": "33124",
        "image_url": "http://static.food2fork.com/384988ad12.jpg",
        "social_rank": 99.99999999999999,
        "publisher_url": "http://allrecipes.com"
      },
      {
        "publisher": "The Pioneer Woman",
        "f2f_url": "http://food2fork.com/view/46946",
        "title": "Pork Chops with Pineapple Fried Rice",
        "source_url": "http://thepioneerwoman.com/cooking/2012/03/pork-chops-with-pineapple-fried-rice/",
        "recipe_id": "46946",
        "image_url": "http://static.food2fork.com/pineappled39c.jpg",
        "social_rank": 99.99999999999999,
        "publisher_url": "http://thepioneerwoman.com"
      },
      {
        "publisher": "Two Peas and Their Pod",
        "f2f_url": "http://food2fork.com/view/54463",
        "title": "Pumpkin Chocolate Chip Bars",
        "source_url": "http://www.twopeasandtheirpod.com/pumpkin-chocolate-chip-bars/",
        "recipe_id": "54463",
        "image_url": "http://static.food2fork.com/pumpkinchocolatechipbarseac8.jpg",
        "social_rank": 99.99999999999999,
        "publisher_url": "http://www.twopeasandtheirpod.com"
      },
      {
        "publisher": "Closet Cooking",
        "f2f_url": "http://food2fork.com/view/35499",
        "title": "Pumpkin Pie French Toast",
        "source_url": "http://www.closetcooking.com/2009/11/pumpkin-pie-french-toast.html",
        "recipe_id": "35499",
        "image_url": "http://static.food2fork.com/PumpkinPieFrenchToast15002845c7fe.jpg",
        "social_rank": 99.99999999999997,
        "publisher_url": "http://closetcooking.com"
      },
      {
        "publisher": "Two Peas and Their Pod",
        "f2f_url": "http://food2fork.com/view/54363",
        "title": "Chocolate Sheet Cake with Peanut Butter Frosting",
        "source_url": "http://www.twopeasandtheirpod.com/chocolate-sheet-cake-with-peanut-butter-frosting/",
        "recipe_id": "54363",
        "image_url": "http://static.food2fork.com/chocolatesheetcakewithpeanutbutterfrosting3a2ac.jpg",
        "social_rank": 99.99999999999997,
        "publisher_url": "http://www.twopeasandtheirpod.com"
      },
      {
        "publisher": "Whats Gaby Cooking",
        "f2f_url": "http://food2fork.com/view/f1b0c0",
        "title": "Slutty Brownies",
        "source_url": "http://whatsgabycooking.com/slutty-brownies/",
        "recipe_id": "f1b0c0",
        "image_url": "http://static.food2fork.com/BrownieFeature193f.jpg",
        "social_rank": 99.99999999999997,
        "publisher_url": "http://whatsgabycooking.com"
      },
      {
        "publisher": "Closet Cooking",
        "f2f_url": "http://food2fork.com/view/35560",
        "title": "Rolo Cheesecake Bars",
        "source_url": "http://www.closetcooking.com/2012/10/rolo-cheesecake-bars.html",
        "recipe_id": "35560",
        "image_url": "http://static.food2fork.com/Rolo2BCheesecake2BBars2B5002B730529a926ca.jpg",
        "social_rank": 99.99999999999997,
        "publisher_url": "http://closetcooking.com"
      }
    ]
  };


database.ref().once("value", function(snapshot){
    dbState = snapshot;
});


$("#new-user-btn").on("click", function() {
    tempUserName = $("#new-user-input").val().toUpperCase().trim();
    if (!dbState.child("/" + tempUserName).exists()) {
    currentUser = database.ref("/" +tempUserName );
    currentUser.set({
        username : $("#new-user-input").val().trim()
    });
    } else alert('Username Already Exists');
});

$("#existing-user-btn").on("click", function() {
    tempUserName = $("#existing-user-input").val().toUpperCase().trim();
    if (dbState.child("/" + tempUserName).exists()) {
        currentUser = database.ref("/" + tempUserName);
        console.log('you are "logged in"');
    }
});

for (let [key, value] of Object.entries(response.recipes)) {
    console.log(key, value.f2f_url);
}
    


