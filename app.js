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
  Form({ data: bodyData }).save((err) => {
    if (err) {
      throw err;
    }
  });
};

//for admin to see the form details
// var userSchema = new mongoose.Schema({
//   name: String,
//   phone: String,
//   email: String,
//   message: String,
// });

// userTable = mongoose.model("users", userSchema);

var fetchData = (callback) => {
  var userData = Form.find({});
  
  userData.exec(function (err, data) {
    if (err) throw err;
    // console.log((data));
    return callback(data);
  });
};

var fetchTheData = (req, res) => {
  fetchData(function (data) {
    res.render("user-table", { userData: data });
  });
};

var router = express.Router();
router.get('/admin',fetchTheData);

app.use("/", router); 

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const server = require("http").Server(app);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/contact.html", (req, res) => {
  res.render("contact");
});

app.post("/contact.html", urlencodedParser, (req, res) => {
  // console.log(req.body);
  formData(req.body);
  res.render("success.ejs");
});

// app.get("/admin.html", urlencodedParser, (req, res) => {
//   res.render("admin.ejs");
// });

server.listen(port);