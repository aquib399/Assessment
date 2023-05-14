require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.URL);
const db = client.db("internshala").collection("products");
//Connecting to database

app.get("/", (req, res) => {
    const homePage = path.join(__dirname, "index.html");
    res.sendFile(homePage);
});

app.get("/listProduct", async (req, res) => {
    try {
        const data = await db.find().toArray();
        res.send({ data });
    } catch (err) {
        res.send({ code: 503 });
    }
});

app.post("/retrieve", async (req, res) => {
    const id = req.body.ID;
    try {
        const data = await db.findOne({ id });
        if (data) {
            res.send(data);
            return;
        }
    } catch (err) {
        res.send({ code: 503 });
        return;
    }
    res.send({ code: 404 });
});

app.put("/update/:id/:price", async (req, res) => {
    const { id, price } = req.params;
    try {
        if (isNaN(price)) {
            throw { code: 405 };
        }
        const data = await db.findOneAndUpdate({ id }, { $set: { price } });
        if (data.lastErrorObject.updatedExisting) {
            res.send({ code: 200 });
            return;
        }
        res.send({ code: 400 });
        return;
    } catch (err) {
        res.send({ code: err.code || 503 });
    }
});
app.listen(process.env.PORT);
