import { validate as uuidValidate } from "uuid";
import { DataBase } from "../db.js";
import errorMessages from "../errorMessages.js";
import type { RequestListener } from "http";

export class GetRequestHandler {
    private _db: DataBase;

    constructor(db: DataBase) {
        this._db = db;
    }

    listener(
        req: Parameters<RequestListener>[0],
        res: Parameters<RequestListener>[1]
    ) {
        const matchedUsers = req.url?.match(
            /api\/users(\/(?<userId>[^\/]+))?$/
        );

        if (matchedUsers) {
            const userId = matchedUsers.groups?.userId;
            if (userId) {
                // case api/users/{userId}
                const isValidID = uuidValidate(userId);
                if (isValidID) {
                    const user = this._db.getUserById(userId);
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
                // case api/users
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.write(JSON.stringify(this._db.users));
                res.end();
            }
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(errorMessages.resourseNotFound);
        }
    }
}
