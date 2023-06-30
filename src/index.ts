import http from "http";
import errorMessages from "./errorMessages.js";

//TODO: get port from .env
const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
    try {
        switch (req.method) {
            case "GET":
                break;
            case "POST":
                break;
            case "PUT":
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
