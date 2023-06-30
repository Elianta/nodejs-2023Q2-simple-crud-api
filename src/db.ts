import { v4 as uuid } from "uuid";

export interface IUser {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

export class DataBase {
    private _users: IUser[];

    constructor(users: IUser[]) {
        this._users = users;
    }

    get users(): IUser[] {
        return this._users;
    }

    getUserById(id: string): IUser | null {
        return this._users.find((user) => user.id === id) ?? null;
    }

    addUser(data: Partial<IUser>): IUser | null {
        if (!data.username || typeof data.username !== "string") return null;
        if (typeof data.age !== "number") return null;
        if (
            !Array.isArray(data.hobbies) ||
            data.hobbies.some((el) => typeof el !== "string")
        )
            return null;

        const newUser = { id: uuid(), ...data } as IUser;
        this._users.push(newUser);
        return newUser;
    }
}
