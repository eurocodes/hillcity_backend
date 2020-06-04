const supertest = require("supertest");
const app = require("../src/App");
const dummyUser = require("./utils/user.data");

const request = supertest(app);

describe("Mentee Engagements", () => {
    let token;
    beforeAll(done => {
        request.post("/api/v1/auth/login").send(dummyUser.user)
            .end((err, res) => {
                token = res.body.data.token;
                expect(res.status).toBe(200);
                done();
            })
    })

    it("Gets all engagements belonging to a mentee", async done => {
        const response = await request.get("/api/v1/get/mentee/engagements").set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Gets one engagement belonging to a mentee given id", async done => {
        const response = await request.get("/api/v1/get/engagements/EN-9WHG.04.Oct").set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        done();
    })
})

describe("Mentor Engagements", () => {
    let token;
    beforeAll(done => {
        request.post("/api/v1/auth/login").send(dummyUser.mentor)
            .end((err, res) => {
                token = res.body.data.token;
                expect(res.status).toBe(200);
                done();
            })
    })

    it("Gets all engagements belonging to a mentor", async done => {
        const response = await request.get("/api/v1/get/mentor/engagements").set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Gets one engagement belonging to a mentor given id", async done => {
        const response = await request.get("/api/v1/get/engagements/EN-ZJ1L.08.Dec").set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Accepts engagement belonging to a mentor given id", async done => {
        const response = await request.put("/api/v1/update/accepted/engagements/EN-ZJ1L.08.Dec").set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Cannot find requested Engagement", async done => {
        const response = await request.put("/api/v1/update/accepted/engagements/EN-ZJ1L.08.D").set("Authorization", token);
        expect(response.status).toBe(404);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Assigns task to an engagement belonging to a mentor given id", async done => {
        const response = await request.put("/api/v1/update/task-assigned/engagements/EN-ZJ1L.08.Dec").set("Authorization", token)
            .send({
                engagementTask: "This is your sample task",
                taskType: "Academics",
            })
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Fails to assign task, Error", async done => {
        const response = await request.put("/api/v1/update/task-assigned/engagements/EN-ZJ1L.08.Dec").set("Authorization", token)
            .send({})
        expect(response.status).toBe(403);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Cannot find requested Engagement", async done => {
        const response = await request.put("/api/v1/update/task-assigned/engagements/EN-ZJ1L.08.D").set("Authorization", token);
        expect(response.status).toBe(404);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Rejects engagement belonging to a mentor given id", async done => {
        const response = await request.put("/api/v1/update/rejected/engagements/EN-ZJ1L.08.Dec").set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Cannot find requested Engagement", async done => {
        const response = await request.put("/api/v1/update/rejected/engagements/EN-ZJ1L.08.D").set("Authorization", token);
        expect(response.status).toBe(404);
        expect(response.type).toBe("application/json");
        done();
    })
})

describe("Mentee Engagements", () => {
    let token;
    beforeAll(done => {
        request.post("/api/v1/auth/login").send(dummyUser.nonEng)
            .end((err, res) => {
                token = res.body.data.token;
                expect(res.status).toBe(200);
                done();
            })
    })

    it("Creates Engagement", async done => {
        const response = await request.post("/api/v1/post/engagement/create/new").set("Authorization", token)
            .send({
                modeOfEngagement: "Technology Enabled",
                proposedDate: "30-July-2020",
                proposedTime: "4:00pm",
                engagementType: "General",
                reasonForEngagement: "I need guidance on my academics, testing Admin",
            })
        expect(response.status).toBe(201);
        expect(response.type).toBe("application/json");
        done();
    })

    it(" Fails to Create Engagement", async done => {
        const response = await request.post("/api/v1/post/engagement/create/new").set("Authorization", token)
            .send({})
        expect(response.status).toBe(400);
        expect(response.type).toBe("application/json");
        done();
    })
})

describe("Mentee Engagements", () => {
    let token;
    beforeAll(done => {
        request.post("/api/v1/auth/login").send(dummyUser.nonEng)
            .end((err, res) => {
                token = res.body.data.token;
                expect(res.status).toBe(200);
                done();
            })
    })

    it("Accepts engagement belonging to a mentor given id", async done => {
        const response = await request.put("/api/v1/update/accepted/engagements/EN-ZJ1L.08.Dec").set("Authorization", token);
        expect(response.status).toBe(401);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Accepts engagement belonging to a mentor given id", async done => {
        const response = await request.put("/api/v1/update/rejected/engagements/EN-ZJ1L.08.Dec").set("Authorization", token);
        expect(response.status).toBe(401);
        expect(response.type).toBe("application/json");
        done();
    })

    it("Accepts engagement belonging to a mentor given id", async done => {
        const response = await request.put("/api/v1/update/task-assigned/engagements/EN-ZJ1L.08.Dec").set("Authorization", token);
        expect(response.status).toBe(401);
        expect(response.type).toBe("application/json");
        done();
    })
})