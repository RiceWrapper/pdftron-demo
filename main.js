const fs = require("fs");
const Path = require("path");
const formidable = require("formidable");
const http = require("http");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const rootPath = (/[\/\\]node[.exe]?/i.test(process.execPath)) ? __dirname : Path.dirname(process.execPath);

const dataDir = __dirname + "/data";
const PRODUCT_SETS_PATH = Path.join(dataDir, 'dataProductSets.json');
var PRODUCT_SETS = require(PRODUCT_SETS_PATH);

app.use(express.static(Path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true })); // Nested JSON is allowed
app.use(bodyParser.json());

const mainPage = __dirname + "/pages/index.html";
app.get("/", (req, res) => {
    res.sendFile(mainPage);
});

app.get("/loadPDF", (req, res) => {
    res.type('blob');
    try {
        let filename = 'mydoc.pdf';
        let document = fs.readFileSync(`${__dirname}/data/${filename}`);
        res.status(200);
        res.send(Buffer.from(document));
    } catch (err) {
        res.status(404);
    }
    res.end();
});

app.post("/savePDF", async (req, res) => {
    let form = new formidable.IncomingForm();
    try {
        let data = await new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, uploadedFile) => {
                if (err) reject(err);
                else {
                    fields['file'] = uploadedFile.file;
                    resolve(fields);
                }
            });
        });
        const tmpBuf = fs.readFileSync(data.file.path);
        const buf = Buffer.from(tmpBuf);
        await new Promise((resolve, reject) => {
            fs.writeFile(`${__dirname}/data/${data.file.name}`, buf, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            })
        });
        await new Promise((resolve, reject) => {
            fs.writeFile(`${__dirname}/data/${data.file.name}.xml`, data.annotation, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            })
        });
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(404);
    }
})

app.get("/getProductSets", async (req, res) => {
    try {
        res.status(200);
        res.json(PRODUCT_SETS);
    } catch (err) {
        res.sendStatus(404);
    }
})

app.post("/saveProductSet", async (req, res) => {
    let prod_set_name = req.body.prod_set_name;
    try {
        PRODUCT_SETS[prod_set_name] = {
            "src": "./images/deadbolt.png", "items": []
        };
        await new Promise((resolve, reject) => {
            fs.writeFile(PRODUCT_SETS_PATH, JSON.stringify(PRODUCT_SETS), (err) => {
                if (err) {
                    reject(new Error('Json db not found.'));
                } else {
                    resolve();
                }
            });
        });
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(404);
    }
})

const HTTP_PORT = 9988;
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
    console.log(`Pdftron Demo starts on http://localhost:${HTTP_PORT}, press Ctrl-C to terminate.`);
});