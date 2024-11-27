const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./starter/modules/replaceTemplate");
const { console } = require("inspector");

let TempOverview;
try {
  TempOverview = fs.readFileSync(
    path.join(__dirname, "starter", "templates", "template-overview.html"),
    "utf-8"
  );
} catch (err) {
  console.log("Error reading", err);
}
let TempCard;
try {
  TempCard = fs.readFileSync(
    path.join(__dirname, "starter", "templates", "template-card.html"),
    "utf-8"
  );
} catch (err) {
  console.log("Error reading", err);
}

let TempProduct;
try {
  TempProduct = fs.readFileSync(
    path.join(__dirname, "starter", "templates", "template-product.html"),
    "utf-8"
  );
} catch (err) {
  console.log("Error reading", err);
}

const data = fs.readFileSync(
  path.join(__dirname, "starter", "dev-data", "data.json"),
  "utf-8"
);
const dataObj = JSON.parse(data); //strng to objct

const slugs = dataObj.map((data) => slugify(data.productName, { lower: true })); //map used for obj to array
console.log(slugs);

dataObj.forEach((data, index) => (data.id = slugs[index]));

console.log(dataObj);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardHtml = dataObj
      .map((data) => replaceTemplate(TempCard, data))
      .join("");
    const overview = TempOverview.replace("{Product_Cards}", cardHtml);
    res.end(overview);
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-type": "text/html" });
    const tempProduct = replaceTemplate(TempProduct, product);
    res.end(tempProduct);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("Page Not Found");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on portt..");
});

// const app = express();
// app.get("/", (req, res) => {
//   res.status(200).send("hello from serverSide");
// });
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "hello from serverSide", app: "natours" });
// });
