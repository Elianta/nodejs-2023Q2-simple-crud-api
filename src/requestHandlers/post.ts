import { DataBase } from "../db.js";
import errorMessages from "../errorMessages.js";
import type { RequestListener } from "http";

export class PostRequestHandler {
    private _db: DataBase;

    constructor(db: DataBase) {
        this._db = db;
    }

    listener(
        req: Parameters<RequestListener>[0],
        res: Parameters<RequestListener>[1]
    ) {
        switch (req.url) {
            case "/api/users": {
                let data: any[] = [];

                req.on("data", (dataChunk) => {
                    data.push(dataChunk);
                });

                req.on("end", () => {
                    const dataString = Buffer.concat(data).toString();
                    try {
                        const userData = JSON.parse(dataString);
                        const user = this._db.addUser(userData);
                        if (user !== null) {
                            res.writeHead(201, {
                                "Content-Type": "application/json",
                            });
                            res.end(JSON.stringify(user));
                        } else {
                            res.writeHead(400, {
                                "Content-Type": "application/json",
                            });
                            res.end(errorMessages.invalidBody);
                        }
                    } catch {
                        res.writeHead(400, {
                            "Content-Type": "application/json",
                        });
                        res.end(errorMessages.invalidJSON);
                    }
                });
                return;
            }
            default:
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(errorMessages.resourseNotFound);
        }
    }
}
