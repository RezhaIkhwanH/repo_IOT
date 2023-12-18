const express = require('express');
const cros = require("cors");
const app = express();
const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("uptight-tan-overcoatCyclicDB")


app.use(cros());
app.use(express.json(true));

const Data = "data";
const Seting = "data";

const data = db.collection(Data);
const seting = db.collection(Seting);


// (async function () {
//     await seting.set("SettingAwal", {
//         suhu: "30",
//         kelembapan: "50",
//         cahaya: "50"
//     })
// })();

app.get('/', async function (req, res) {

    res.send({ pesan: "api ok" })
})

app.get("/getLastData", async function (req, res) {
    const { results: dataMeta } = await data.list()
    const lastData = dataMeta[0];
    const dataResult = (await data.get(lastData.key)).props
    console.log(dataMeta);
    console.log(lastData);
    console.log(dataResult);

    res.send(dataResult);
})

app.get("/getAllData", async function (req, res) {
    const { results: dataMeta } = await data.list();

    const dataResult = await Promise.all(
        dataMeta.map(async ({ key }) => (await data.get(key)).props)
    );
    res.send(dataResult);
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
    await seting.set(Seting, {
        suhu,
        kelembapan,
        cahaya
    })
    res.send({ pesan: "seting save", data: req.body })
})

app.get('/getSeting', async function (req, res) {
    let item = await seting.get(Seting)
    const suhu = item.props["suhu"];
    const kelembapan = item.props["kelembapan"];
    const cahaya = item.props["cahaya"];
    res.send({ suhu, kelembapan, cahaya })
})

app.get('/getSetingAwal', async function (req, res) {
    let item = await seting.get("SettingAwal");
    const suhu = item.props["suhu"];
    const kelembapan = item.props["kelembapan"];
    const cahaya = item.props["cahaya"];
    res.send({ suhu, kelembapan, cahaya })
})

app.listen(5000, () => {
    console.log(`Example app listening at http://localhost:${5000}`);
});
