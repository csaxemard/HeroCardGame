import { createBrowserRouter } from "react-router";

import Home from "./Views/Home";
import CardViewer from "./Views/Catalogue";
import Error404 from "./Views/Error404";
import Match from "./Views/Match.tsx";



const router = createBrowserRouter([
    { path: "/", Component: Home },
    { path: "/catalogue/:cardId?", Component: CardViewer, },
    { path: "/match", Component: Match },
    { path: "*", Component: Error404 },
], {})

export default router