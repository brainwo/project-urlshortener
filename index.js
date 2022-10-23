require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

var number = 1;
// This isn't the best method but works
// Literally doubles the amount of memory needed to store urls
var shortToLong = {};
var longToShort = {};

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", function (_, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

// redirect to long url
app.get("/api/shorturl/:number", function (req, res) {
    if (shortToLong[req.params.number] === undefined) {
        res.json({ error: "No short URL found for the given input" });
        return;
    }
    res.redirect(shortToLong[req.params.number]);
});

// short a long url
app.post("/api/shorturl", function (req, res) {
    const re = new RegExp(
        "http[s]?://[a-zA-Z][0-9a-zA-Z\\.]*\\.(com|org|net|int|edu|gov|mil|io|gl|dev)[/[0-9a-zA-Z]*]*"
    );

    if (req.body.url.match(re) === null) {
        res.json({ error: "Invalid URL" });
        return;
    }

    if (longToShort[req.body.url] === undefined) {
        shortToLong[number] = req.body.url;
        longToShort[req.body.url] = number;
        res.json({ original_url: req.body.url, short_url: number });
        number++;
    } else {
        res.json({
            original_url: req.body.url,
            short_url: longToShort[req.body.url],
        });
    }
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
