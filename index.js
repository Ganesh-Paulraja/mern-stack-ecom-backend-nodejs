const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

  //schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running good");
});

//sign up
app.post("/signup", async (req, res) => {
  // console.log(req.body);
  const { email } = req.body;

  userModel.findOne({ email: email }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "An error occurred" });
    } else {
      if (result) {
        res.send({ message: "Email id is already registered", alert: false });
      } else {
        const data = new userModel(req.body);
        data.save((err) => {
          if (err) {
            console.error(err);
            res.status(500).send({ message: "Registration failed" });
          } else {
            res.send({ message: "Successfully signed up", alert: true });
          }
        });
      }
    }
  });
});

//api login
app.post("/login", (req, res) => {
  // console.log(req.body);
  const { email } = req.body;
  userModel.findOne({ email: email }, (err, result) => {
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({
        message: "Login is successfully",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
  });
});


//Product Section
const schemaProduct = mongoose.Schema(
  {
    name: String,
    category: String,
    image: String,
    price: String,
    description: String,
  }
)
const productModel = mongoose.model("product-data", schemaProduct);

//save product in api
app.post("/uploadProduct", async (req, res) => {
  const data = await productModel(req.body)
  const dataSave = await data.save()
  res.send({message: 'Upload successfully'})
})

//get all product
app.get('/product', async(req, res) => {
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})



//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));