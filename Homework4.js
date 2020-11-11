var mysql = require("mysql");
var con = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "242000relyt",
    database: "CSE316"
});

const express = require("express");
const app = express();
const url = require('url');

app.get("/", (req, res) => {
    writeSearch(req,res);
});

app.get("/schedule", (req, res) =>{
    writeSchedule(req, res);
});

port = process.env.PORT || 3000;
app.listen(port, () => {console.log("server started!");});

function writeSearch(req, res) {
res.writeHead(200, { "Content-Type": "text/html"});
    let query = url.parse(req.url, true).query;
    let search = query.search ? query.search : "";
    let filter = query.filter ? query.filter : "";

    let htmlFind = `
    <!DOCTYPE html>
    <html lang = "en">
    <head><title>Class Find</title></head>
    <body>
    <h1>Class Find</h1><br>
    <form method = "get" action = "/">
    <input type= "text" name="search" value="">
    <b>in</b>
    <select name = "filter">
    <option value= "all">All</option>
    <option value= "Name">Name</option>
    <option value= "Num">Number</option>
    <option value= "Days">Day</option>
    <option value= "Time">Time</option>
    </select>
    <input type= "submit" value= "Submit">
    <br>
    </form>
    <br><br>
    `;

    let sql = "SELECT * FROM class;";

    if (filter == "all")
        sql = `SELECT * FROM class
            WHERE
            Course LIKE '` +search+ `' OR
            Name LIKE '%` +search+ `%' OR
            Days LIKE '%` +search+ `%' OR
            StartTime LIKE '` +search+ `';`;
    else if (filter == "Name")
        sql = `SELECT * FROM class
            WHERE
            Name LIKE '%` +search+ `%';`;
    else if (filter == "Num")
        sql = `SELECT * FROM class
            WHERE
            Course LIKE '` +search+ `';`;
    else if (filter == "Days")
        sql = `SELECT * FROM class
            WHERE
            Days LIKE '%` +search+ `%';`;
    else if (filter == "Time")
        sql = `SELECT * FROM class
            WHERE
            Time LIKE '%` +search+ `%';`;
    else sql = `SELECT * FROM class;`;

    con.query(sql, function(err,result) {
        if(err) throw err;
        for (let item of result) {
                htmlFind +=
                `<button type="button" class= "toggle"> ` +item.Subject+item.Course+ `.` +item.Component+item.Section+ `
                 ` +item.Name+ `</button>
                 <pre>
                  Days: ` +item.Days+ `
                  Start Time: ` +item.StartTime+ `
                  End Time: ` +item.EndTime+ `
                  Start Date: ` +item.StartDate+ `
                  End Date: ` +item.EndDate+ `
                  Duration: ` +item.Duration+ `
                  Mode: ` +item.InstructionMode+ `
                  Building: ` +item.Building+ `
                  Room: ` +item.Room+ `
                  Instructor: ` +item.Instructor+ `
                  Enrollment Cap: ` +item.EnrollCap+ `
                  Wait Cap: ` +item.WaitCap+ `
                  Combined Description: ` +item.CombDesc+ `
                  Combined Enrollment Cap: ` +item.CombEnrollCap+ `<form action= "/schedule" method="get">
                  <button name="add" value"` +item.id+ `"> Add</button></form></pre>`;
            }
            res.write(htmlFind + "</body></html>");
            res.end();
        });
};
/*
let htmlSchedule = 
`<!DOCTYPE HTML>


<html lang= "en">

<head>

<meta charset="utf-8">

</head>

<style>

td {background-color: lightblue; border-style: ridge; padding: 10px;}
th {background-color: Gray; color: white; padding-left: 25px; padding-right: 25px;}
table {background-color: gainsboro; border-style: ridge; padding-bottom: 5cm;}

</style>

<body>
<h1>Schedule</h1>

<table>
<tr>
<th>SUN</th>
<th>MON</th>
<th>TUE</th>
<th>WED</th>
<th>THU</th>
<th>FRI</th>
<th>SAT</th>
</tr>
<tr>
</tr>
<tr>
</tr>
</table>

</body>

</html>`;
*/