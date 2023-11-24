const express = require('express');
const cros = require("cors");
const app = express();
const db = require('@cyclic.sh/dynamodb');


app.use(cros());
app.use(express.json(true));
const data = db.collection("data");
const seting = db.collection("seting");

// (async function () {
//     let setingAwal = await seting.set("setingAwal", {
//         suhu: "30",
//         kelembapan: "50",
//         cahaya: "500"
//     })
// })();
(function () {
    console.log('IIFE');
})();

app.get('/', async function (req, res) {
    let item = await seting.get("setingAwal")
    console.log(item);
    res.send("api run")
})

app.listen(8080, () => {
    console.log(`Example app listening at http://localhost:${8080}`);
});
