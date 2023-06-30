import { validate as uuidValidate } from "uuid";
import { DataBase } from "../db.js";
import errorMessages from "../errorMessages.js";
import type { RequestListener } from "http";

export class PutRequestHandler {
    private _db: DataBase;

    constructor(db: DataBase) {
        this._db = db;
    }

    listener(
        req: Parameters<RequestListener>[0],
        res: Parameters<RequestListener>[1]
    ) {
        let data: any[] = [];

        req.on("data", (dataChunk) => {
            data.push(dataChunk);
        });

        req.on("end", () => {
            const dataString = Buffer.concat(data).toString();
            try {
                const userData = JSON.parse(dataString);
                const matchedUsers = req.url?.match(
                    /api\/users\/(?<userId>[^\/]+)$/
                );

                if (matchedUsers) {
                    const userId = matchedUsers.groups!.userId as string;

                    // case api/users/{userId}
                    const isValidID = uuidValidate(userId);
                    if (isValidID) {
                        const user = this._db.updateUserById(userId, userData);
                        if (user) {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.write(JSON.stringify(user));
                            res.end();
                        } else {
                            res.writeHead(404, {
                                "Content-Type": "application/json",
                            });
                            res.end(errorMessages.userNotFound);
                        }
                    } else {
                        // invalid userId
                        res.writeHead(400, {
                            "Content-Type": "application/json",
                        });
                        res.end(errorMessages.invalidUserId);
                    }
                } else {
                    res.writeHead(404, {
                        "Content-Type": "application/json",
                    });
                    res.end(errorMessages.resourseNotFound);
                }
            } catch {
                res.writeHead(400, {
                    "Content-Type": "application/json",
                });
                res.end(errorMessages.invalidJSON);
            }
        });
    }
}
