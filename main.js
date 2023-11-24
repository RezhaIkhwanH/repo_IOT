const express = require('express');
const cros = require("cors");
const app = express();
const db = require('@cyclic.sh/dynamodb');


app.use(cros());
app.use(express.json(true));
const data = db.collection("data");
const seting = db.collection("seting");


// (async function () {
//     await seting.set("setingAwal", {
//         suhu: "30",
//         kelembapan: "50",
//         cahaya: "500"
//     })
// })();

app.get('/', async function (req, res) {
    let item = await seting.get("setingAwal")
    console.log(item);
    res.send({ pesan: "api ok", data: item.props })
})

app.get("/getData", async function (req, res) {
    const { results: dataMeta } = await data.list();

    const data = await Promise.all(dataMeta.map(async ({ key }) => (await bikesCollection.get(key)).props));
    res.send(data);
})
app.post("/createdData", async function (req, res) {

    const suhu = req.body.suhu;
    const cahaya = req.body.cahaya;
    const kelembapan = req.body.kelembapan;
    const kelembapanUdara = req.body.kelembapanUdara;
    const key = new Date().getTime().toString();
    try {
        await data.set(key, {
            suhu,
            kelembapan,
            kelembapanUdara,
            cahaya
        })
        res.send({ pesan: "berhasil", data: (await data.get(key)).props })

    } catch (error) {
        res.status(500).send({ pesan: "gagal" })

    }

})

app.post('/createdSeting', async function (req, res) {
    // 
    const suhu = req.body.suhu;
    const cahaya = req.body.cahaya;
    const kelembapan = req.body.kelembapan;
    await seting.set("seting", {
        suhu,
        kelembapan,
        cahaya
    })
    res.send({ pesan: "seting save", data: req.body })
})

app.get('/getSeting', async function (req, res) {
    let item = await seting.get("seting")
    res.send({ pesan: "api ok", data: item.props })
})

app.get('/getSetingAwal', async function (req, res) {
    let item = await seting.get("setingAwal")
    res.send({ pesan: "api ok", data: item.props })
})

app.listen(8080, () => {
    console.log(`Example app listening at http://localhost:${8080}`);
});
