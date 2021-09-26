import express, { Application, Request, Response, json, urlencoded } from "express";
import getProduct from "./src/controllers/get-product";
import addItem from "./src/controllers/add-item";
import getItem from "./src/controllers/get-item";
import sellItem from "./src/controllers/sell-item";

const app: Application = express();
const port = process.env.PORT || 3000;

// Body parsing Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/:item", getProduct);
app.post("/:item/add", addItem);
app.get("/:item/quantity", getItem);
app.post("/:item/sell", sellItem);

// Handles 404
app.use("*", async (req: Request, res: Response) => {
  res.status(400).send({
    message: "Bad Request",
  });
});

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (e: any) {
  console.error(`Error occured: ${e.message}`);
}
