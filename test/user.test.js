const supertest = require("supertest");
const app = require("../src/App");
const dummyUser = require("./utils/user.data");

const request = supertest(app);

describe("User actions", () => {

    it("Logs in user", async done => {
        const response = await request.post("/api/v1/auth/login").send(dummyUser.user);
        expect(response.status).toBe(200);
        done();
    })

    it("Fails user login, Missing some values", async done => {
        const response = await request.post("/api/v1/auth/login").send({ email: "", password: "" });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Some values are missing");
        done();
    })

    it("Fails user login, Record not found", async done => {
        const response = await request.post("/api/v1/auth/login").send(dummyUser.wrongUser);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Your data cannot be found on our database");
        done();
    })

    it("Fails user login, Record not found", async done => {
        const response = await request.post("/api/v1/auth/login").send(dummyUser.wrongPass);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("The credentials you provided is incorrect");
        done();
    })
})

describe("Users can get People connected with them", () => {
    let token;
    beforeAll(done => {
        request.post("/api/v1/auth/login").send(dummyUser.user)
            .end((err, res) => {
                token = res.body.data.token;
                expect(res.status).toBe(200);
                done();
            })
    })

    it("Should require authorization, GET Fail", async done => {
        const response = await request.get("/api/v1/auth/mentee/dashboard");
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is not provided");
        done();
    })
    it("Gets Mentors details of a mentee", async done => {
        const response = await request.get("/api/v1/auth/mentee/dashboard").set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        done();
    })

})

describe("Users can get People connected with them", () => {
    let token;
    beforeAll(done => {
        request.post("/api/v1/auth/login").send(dummyUser.mentor)
            .end((err, res) => {
                token = res.body.data.token;
                expect(res.status).toBe(200);
                done();
            })
    })

    it("Gets Mentees details of a mentor", async done => {
        const response = await request.get("/api/v1/auth/mentor/dashboard").set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        done();
    })

})