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




// Global Objects-----------------------------------------------------------------------------------------------------------------

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
// let posts1;
const id = process.env.SHEET_ID

// // Get requests--------------------------------------------------------------------------------------------------------------------------

app.get("/about", function(req,res){
 
    res.render("about",{text2 : aboutContent});
  
  });
  
  
  app.get("/contact", function(req,res){
  
    res.render("contact",{text3 : contactContent});
  
  });
  


app.get("/compose", function(req,res){

  res.render("compose");

});


app.get("/posts/:postName", function(req, res){

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



  


app.get('/', async(req, res)=>{
    try{
        const {sheets} = await authentication();
    
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: id,
            range: 'Sheet1'
        })
        posts1 = response.data;
        console.log(posts1);
  

        res.render("home",{blogPost : posts1});
    }   catch(e){
        console.log(e);
        res.status(500).send();
    }
});


app.post('/publish', async(req, res)=>{

    try{
        // console.log(posts1);
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
                ]
            }
        })
        res.redirect("/")

    }catch(e){
        console.log("ERROR WHILE UPDATING THE SPREADSHEET", e);
        res.status(500).send();
    }

});

app.listen(process.env.PORT || 3000, () => console.log("server is running on port 3000"))

