import { validate as uuidValidate } from "uuid";
import { DataBase } from "../db.js";
import errorMessages from "../errorMessages.js";
import type { RequestListener } from "http";

export class DeleteRequestHandler {
    private _db: DataBase;

    constructor(db: DataBase) {
        this._db = db;
    }

    listener(
        req: Parameters<RequestListener>[0],
        res: Parameters<RequestListener>[1]
    ) {
        const matchedUsers = req.url?.match(/api\/users\/(?<userId>[^\/]+)$/);

        if (matchedUsers) {
            const userId = matchedUsers.groups!.userId as string;

            // case api/users/{userId}
            const isValidID = uuidValidate(userId);
            if (isValidID) {
                const isDeleted = this._db.deleteUserById(userId);
                if (isDeleted) {
                    res.statusCode = 204;
                    res.setHeader("Content-Type", "application/json");
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
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(errorMessages.resourseNotFound);
        }
    }
}
