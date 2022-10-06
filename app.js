const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("node:https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        email_type: "text",
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us9.api.mailchimp.com/3.0/lists/b84ea1df23";
  const options = {
    method: "POST",
    auth: process.env.MAILCHIMP_AUTH,
  }

  const request = https.request(url, options, (response) => {
    let responseStatus = Number(response.statusCode);

    if (responseStatus === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

})

app.post("/failure.html", (req, res) => {
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, () => {
  console.log("Server is up and running on port 3000");
});
