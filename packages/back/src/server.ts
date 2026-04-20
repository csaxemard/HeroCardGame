import express, { Request, Response } from "express";
import path from "path";
import fs from "fs"

import { constants } from "@herocardgame/shared"



const app = express();

app.use(express.json());   // devlearn: Permet de parser le body d'une requête en json (si Content-Type: application/json dans le header de la req)
app.use(express.static(constants.paths.webDistDir));   // devlearn: Définit un dossier contenant les fichiers statiques à servir quand l'url correspond à leur path

app.get("*catchAll", (_req, res: Response) => {
    const filePath = path.join(constants.paths.webDistDir, "./index.html");
    res.sendFile(filePath);
});

app.post("/api/hello", (req: Request, res: Response) => {
    res.json({msg: "📧 : Hello !"})
    console.log(req.body);
})

const port = 3000;
app.listen(port,
    () => console.log(`Server running on http://localhost:${port}`)
);
