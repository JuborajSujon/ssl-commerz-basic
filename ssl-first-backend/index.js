const express = require("express");
const { default: axios } = require("axios");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@smdeveloper.7rzkdcv.mongodb.net/?retryWrites=true&w=majority&appName=SMDeveloper`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const payments = client.db("ssl").collection("payments");

    app.post("/create-payment", async (req, res) => {
      const payment = req.body;

      const trxId = new ObjectId().toString();
      const initiateData = {
        store_id: process.env.SSL_STORE_ID,
        store_passwd: process.env.SSL_STORE_PASS,
        total_amount: payment.amount,
        currency: "BDT",
        tran_id: trxId,
        success_url: "http://localhost:5000/success-payment",
        fail_url: "http://localhost:5000/fail",
        cancel_url: "http://localhost:5000/cancle",
        product_name: "Electronics",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: payment.user_name,
        cus_email: "cust@yahoo.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: 1000,
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        shipping_method: "NO",
        multi_card_name: "mastercard,visacard,amexcard",
        value_a: "ref001_A",
        value_b: "ref002_B",
        value_c: "ref003_C",
        value_d: "ref004_D",
      };

      const response = await axios({
        method: "POST",
        url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
        data: initiateData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const saveData = {
        cus_name: payment.user_name,
        paymentId: trxId,
        amount: payment.amount,
        status: "Pending",
      };

      const result = await payments.insertOne(saveData);

      if (result.acknowledged) {
        res.send({
          paymentUrl: response.data.GatewayPageURL,
        });
      }
    });

    app.post("/success-payment", async (req, res) => {
      const successData = req.body;

      if (successData.status !== "VALID") {
        throw new Error("Invalid Transaction");
      }

      // update payment status
      const query = {
        paymentId: successData.tran_id,
      };
      console.log("query", query);

      const update = {
        $set: {
          status: "Success",
        },
      };

      const updateData = await payments.updateOne(query, update);

      // console.log("updateData", updateData);
      // console.log("successData", successData);
      res.redirect("http://localhost:5173/success");
    });

    app.post("/fail", async (req, res) => {
      res.redirect("http://localhost:5173/fail");
    });

    app.post("/cancle", async (req, res) => {
      res.redirect("http://localhost:5173/cancle");
    });

    console.log("You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Hello From SSL First Backend");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/**
 * step 1 : Initiate Payment
 * post Request : https://sandbox.sslcommerz.com/gwprocess/v4/api.php
 * step 2 : Redirect to SSLCOMMERZ
 * step 3 : save payment data in mongodb
 *
 *
 *
 */
