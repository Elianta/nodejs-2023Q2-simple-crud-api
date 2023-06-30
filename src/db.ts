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
}
