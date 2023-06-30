import http from "http";
import errorMessages from "./errorMessages.js";
import {
    GetRequestHandler,
    PostRequestHandler,
    PutRequestHandler,
} from "./requestHandlers/index.js";
import { DataBase } from "./db.js";

//TODO: get port from .env
const PORT = process.env.PORT || 4000;
const db = new DataBase([]);

const server = http.createServer((req, res) => {
    try {
        switch (req.method) {
            case "GET":
                new GetRequestHandler(db).listener(req, res);
                break;
            case "POST":
                new PostRequestHandler(db).listener(req, res);
                break;
            case "PUT":
                new PutRequestHandler(db).listener(req, res);
                break;
            case "DELETE":
                break;
            default:
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(errorMessages.invalidRequest);
        }
    } catch (error) {
        res.writeHead(500, {
            "Content-Type": "application/json",
        });
        res.end(errorMessages.serverError);
    }
});

server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
