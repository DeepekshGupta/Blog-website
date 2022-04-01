require("dotenv").config();
const express = require("express");
const {google} = require('googleapis');
const app = express();

app.use(express.json())

const id = process.env.SHEET_ID


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

        res.send(response.data)
    }   catch(e){
        console.log(e);
        res.status(500).send();
    }
});


app.post('/', async(req, res)=>{

    try{
        const {newName, newValue} = req.body;
        // let values = [
        //     [
        //         'Das some nice sheet',
        //         'temp text 5'
        //     ],
        // ];
        

        const {sheets} = await authentication();

        const writeReq = await sheets.spreadsheets.values.append({
            spreadsheetId: id,
            range: 'Sheet1', 
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    [newName, newValue],
                    // values,
                ]
            }
        })

        if(writeReq.status === 200){
            return res.json({msg: "Spreadsheet updates Succcesfully!"})
        }
        return res.json({msg: "something went wrong while updating the sheet."})
    }catch(e){
        console.log("ERROR WHILE UPDATING THE SPREADSHEET", e);
        res.status(500).send();
    }

});

app.listen(3000, () => console.log("server is running on port 3000"))

