import chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import { NIL as NIL_UUID } from "uuid";
import { server } from "../index.js";
import { IUser } from "../db.js";
import errorMessages from "../errorMessages.js";

chai.use(chaiHttp);

const expect = chai.expect;
const API_URL = "/api/users";
const INVALID_ID = "000-0000";

const TEST_USER_1: Omit<IUser, "id"> = {
    username: "Oleg",
    age: 24,
    hobbies: ["footbal", "video games", "reading"],
};

const TEST_USER_2: Omit<IUser, "id"> = {
    username: "Alice",
    age: 32,
    hobbies: ["travel", "photography", "boxing"],
};

const INVALID_USER = {
    username: "Marta",
    age: "24",
    hobbies: "footbal, video games, reading",
};

describe("CRUD users api test #1. Perfect cases:", () => {
    let userId: number;
    it("should get initial list of users", (done) => {
        chai.request(server)
            .get(API_URL)
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array").that.is.empty;
                done();
            });
    });
    it("should create new user", (done) => {
        chai.request(server)
            .post(API_URL)
            .send(TEST_USER_1)
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an("object");
                expect(res.body).to.include.all.keys(
                    ...Object.keys(TEST_USER_1),
                    "id"
                );
                userId = res.body.id;
                done();
            });
    });
    it("should get created user", (done) => {
        chai.request(server)
            .get(`${API_URL}/${userId}`)
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include({
                    id: userId,
                    ...TEST_USER_1,
                });
                done();
            });
    });
    it("should update created user", (done) => {
        chai.request(server)
            .put(`${API_URL}/${userId}`)
            .send(TEST_USER_2)
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include({
                    id: userId,
                    ...TEST_USER_2,
                });
                done();
            });
    });
    it("should delete created user", (done) => {
        chai.request(server)
            .delete(`${API_URL}/${userId}`)
            .end((_err, res) => {
                expect(res).to.have.status(204);
                done();
            });
    });
    it("should not send data of deleted user", (done) => {
        chai.request(server)
            .get(`${API_URL}/${userId}`)
            .end((_err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.userNotFound)
                );
                done();
            });
    });
});

describe("CRUD users api test #2. Errors:", () => {
    let userId: number;
    it("should create new user", (done) => {
        chai.request(server)
            .post(API_URL)
            .send(TEST_USER_1)
            .end((_err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an("object");
                expect(res.body).to.include.all.keys(
                    ...Object.keys(TEST_USER_1),
                    "id"
                );
                userId = res.body.id;
                done();
            });
    });
    it("should get list of users", (done) => {
        chai.request(server)
            .get(API_URL)
            .end((_err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array").that.have.lengthOf(1);
                done();
            });
    });
    it("should fail on attempt to request non-existing user", (done) => {
        chai.request(server)
            .get(`${API_URL}/${NIL_UUID}`)
            .end((_err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.userNotFound)
                );
                done();
            });
    });
    it("should fail on attempt to update non-existing user", (done) => {
        chai.request(server)
            .put(`${API_URL}/${NIL_UUID}`)
            .send(TEST_USER_2)
            .end((_err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.userNotFound)
                );
                done();
            });
    });
    it("should fail on attempt to delete non-existing user", (done) => {
        chai.request(server)
            .delete(`${API_URL}/${NIL_UUID}`)
            .end((_err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.userNotFound)
                );
                done();
            });
    });
    it("should fail to GET non-existing api url", (done) => {
        chai.request(server)
            .get("/not-exist")
            .end((_err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.resourseNotFound)
                );
                done();
            });
    });
    it("should fail to GET non-existing API_URL on base of existing one", (done) => {
        chai.request(server)
            .get(`${API_URL}/${NIL_UUID}/not-exist`)
            .end((_err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.resourseNotFound)
                );
                done();
            });
    });
    it("should fail to POST non-existing api url", (done) => {
        chai.request(server)
            .post("/not-exist")
            .send(TEST_USER_2)
            .end((_err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.resourseNotFound)
                );
                done();
            });
    });
    it("should fail to PUT non-existing api url", (done) => {
        chai.request(server)
            .put("/not-exist")
            .send(TEST_USER_2)
            .end((_err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.resourseNotFound)
                );
                done();
            });
    });
    it("should fail to DELETE non-existing api url", (done) => {
        chai.request(server)
            .delete("/not-exist")
            .end((_err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.resourseNotFound)
                );
                done();
            });
    });
    it("should clear list of users", () => {
        chai.request(server)
            .delete(`${API_URL}/${userId}`)
            .then((res) => {
                expect(res).to.have.status(204);
                chai.request(server)
                    .get(API_URL)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an("array").that.is.empty;
                    });
            });
    });
});

describe("CRUD users api test #3. Invalid data:", () => {
    let userId: number;
    it("should fail on attempt to request user with invalid id (not uuid)", (done) => {
        chai.request(server)
            .get(`${API_URL}/${INVALID_ID}`)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.invalidUserId)
                );
                done();
            });
    });
    it("should fail on attempt to create user with invalid data", (done) => {
        chai.request(server)
            .post(API_URL)
            .send(INVALID_USER)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.invalidBody)
                );
                done();
            });
    });
    it("should fail on attempt to update user with invalid data", () => {
        chai.request(server)
            .post(API_URL)
            .send(TEST_USER_1)
            .then((res) => {
                userId = res.body.id;
                chai.request(server)
                    .put(`${API_URL}/${userId}`)
                    .send(INVALID_USER)
                    .then((res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.be.an("object");
                        expect(res.body).to.deep.include(
                            JSON.parse(errorMessages.invalidBody)
                        );
                    });
            });
    });
    it("should fail on attempt to update user with invalid id (not uuid)", (done) => {
        chai.request(server)
            .put(`${API_URL}/${INVALID_ID}`)
            .send(TEST_USER_2)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.invalidUserId)
                );
                done();
            });
    });
    it("should fail on attempt to delete user with invalid id (not uuid)", (done) => {
        chai.request(server)
            .delete(`${API_URL}/${INVALID_ID}`)
            .end((_err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an("object");
                expect(res.body).to.deep.include(
                    JSON.parse(errorMessages.invalidUserId)
                );
                done();
            });
    });
});
