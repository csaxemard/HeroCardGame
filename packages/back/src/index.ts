import express, { Response } from "express";

const app = express();

app.use(express.json());   // Permet de parser une requête en json

app.get("/", (_req, res: Response) => {   // devlearn: _req indique à ts que la var est ignorée
    res.send("Hello");
})
app.post("/api/hello", (_req, res: Response) => {
    res.send("📧 : Hello !")
})

const port = 3000;
app.listen(port,
    () => console.log(`Server running on http://localhost:${port}`)
);
