const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = process.env.PORT || 3030;

const url =
  	"mongodb+srv://hemanth:hemanth@mernapp.anilv6w.mongodb.net/?retryWrites=true&w=majority";
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
    res.render("user-table", { userData: data});
  });
};

var router = express.Router();
router.get("/admin", fetchTheData);

app.use("/", router);


//delete

const handleDelete = (id) => {
  console.log("delete in app.js called with id "+id);
}

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

server.listen(port);

