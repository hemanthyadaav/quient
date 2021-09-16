const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = process.env.PORT || 3030; 

const url =
  "mongodb+srv://admin:admin@fswd-p-two.fw5tq.mongodb.net/form?retryWrites=true&w=majority";
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
});

const formSchema = new mongoose.Schema(
  {
    data: Object,
  },
  {
    collection: "contact-form",
  }
);

const Form = mongoose.model("Form", formSchema); 

const formData = (bodyData) => {
    Form({data: bodyData}).save((err) => {
        if(err)
        {
            throw err; 
        }
    })
}

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const server = require("http").Server(app);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/contact.html", (req, res) => {
  res.render("contact");
});

app.post("/contact.html", urlencodedParser, (req, res) => {
  console.log(req.body);
  formData(req.body); 
  res.render("success.ejs");
});

server.listen(port);
