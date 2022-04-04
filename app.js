require("dotenv").config();
const express = require("express");
const {google} = require('googleapis');
const app = express();
const _ = require("lodash");

// app.use(express.json())
app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.static("public"));
  
app.set('view engine', 'ejs');

// let posts1;
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const obj = {
    "range": "Sheet1!A1:Z1000",
    "majorDimension": "ROWS",
    "values": [
        [
            "ID",
            "Title",
            "Content"
        ],
        [
            "1",
            "Holy Sheet!",
            "<p>temp text 1</p>"
        ],
        [
            "2",
            "This is some dank Sheet",
            "<p>temp text 2</p>"
        ],
        [
            "3",
            "I sheet you not my friend",
            "<p>temp text 3</p>"
        ],
        [
            "4",
            "Some next level Sheet",
            "<p>temp text 4</p>"
        ],
        [
            "5",
            "Das some nice sheet",
            "temp text 5"
        ],
        [
            "6",
            "LOL",
            "Lmao"
        ],
        [
            "7",
            "aaa",
            "bbb"
        ]
    ]
};


const id = process.env.SHEET_ID


// Global Objects-----------------------------------------------------------------------------------------------------------------


// Post requests------------------------------------------------------------------------------------------------------------------

// app.post("/compose", function(req, res){
//   // console.log(req.body);
//   // let title = req.body.Title;
//   // let body = req.body.Body;

//   const post = {
//     title : req.body.Title,
//     body  : req.body.Body
//   };

//   Posts.push(post);
//   // console.log(Posts);

//   res.redirect("/")
//   // console.log(body);
// });


app.get("/posts/:postName", function(req, res){

//   console.log(req.params.postName);
  const requestedTitle = _.lowerCase(req.params.postName);

    for(i = 0; i<posts1.values.length;i++){
        const storedTitle = _.lowerCase(posts1.values[i][0]);
        if (storedTitle === requestedTitle) {
            res.render("post", {
            title: posts1.values[i][1],
            content: posts1.values[i][2]
            });
        }
    }
//   Posts.forEach(function(post){
//     const storedTitle = _.lowerCase(post.title);

//     if (storedTitle === requestedTitle) {
//       res.render("post", {
//         title: post.title,
//         content: post.body
//       });
//     }
//   });

});




// // Get requests--------------------------------------------------------------------------------------------------------------------------

app.get("/", function(req,res){
  // res.sendFile(__dirname + "/views/home.ejs")
  // res.render("home",{text1 : homeStartingContent, text2 : aboutContent, text3 : contactContent});

    
    console.log(obj.length);
    // console.log(typeof(obj));
    // console.log(obj.values[0][0] );
    // console.log(obj.values[0][1] );
    // console.log(typeof(obj.values[0][0]));
    // console.log(typeof(obj.values[0][1]));
    // console.log(typeof(homeStartingContent));
    

  res.render("home",{text1 : homeStartingContent, blogPost : obj});

});


// app.get("/about", function(req,res){
 
//   res.render("about",{text2 : aboutContent});

// });


// app.get("/contact", function(req,res){

//   res.render("contact",{text3 : contactContent});

// });


app.get("/compose", function(req,res){

  res.render("compose");

});



// ------------------------------------------------------Google Sheets----------------------------------------------------------
const authentication = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: "https://www.googleapis.com/auth/spreadsheets"

    });

    const client = await auth.getClient();

    const sheets = google.sheets({
        version: 'v4',
        auth: client
    });

    return {sheets}

}



  


app.get('/temp', async(req, res)=>{
    try{
        const {sheets} = await authentication();
    
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: id,
            range: 'Sheet1'
        })
        // console.log(typeof(response.data));
        posts1 = response.data;
        console.log(posts1);
        // console.log(typeof(Posts)); 
        // Posts = Posts.toString();
        // console.log(Posts); 
        // console.log(typeof(Posts));
        // console.log(Posts[0]); 
        // console.log(Posts[1]); 
 

        // res.send(response.data)

        res.render("home",{text1 : homeStartingContent, blogPost : posts1});
    }   catch(e){
        console.log(e);
        res.status(500).send();
    }
});


app.post('/publish', async(req, res)=>{

    try{
        console.log(posts1);
        const ID = posts1.values.length;  
        const newName  = req.body.Title;
        const newValue = req.body.Body;

        


        const {sheets} = await authentication();

        const writeReq = await sheets.spreadsheets.values.append({
            spreadsheetId: id,
            range: 'Sheet1', 
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    [ID, newName, newValue],
                    // values,
                ]
            }
        })
        res.redirect("/")

        // if(writeReq.status === 200){
        //     return res.json({msg: "Spreadsheet updates Succcesfully!"})
        // }
        // return res.json({msg: "something went wrong while updating the sheet."})
    }catch(e){
        console.log("ERROR WHILE UPDATING THE SPREADSHEET", e);
        res.status(500).send();
    }

});

app.listen(3000, () => console.log("server is running on port 3000"))

