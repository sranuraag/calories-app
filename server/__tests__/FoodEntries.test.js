const application = require("../app");
const request = require("supertest");
const { TestWatcher } = require("jest");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { db_insertTestData } = require("../database"); 

let user = {
  id: 1,
  email: "testuser01@example.com",
  first_name: "Test",
  last_name: "User01",
  role: "User",
};
let accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
let userToken = "Bearer " + accessToken;

describe("GET /foodentry", () => {
  test("valid request", async () => {
    const res = await request(application)
      .get("/foodentry")
      .set("Authorization", userToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(expect.any(Array));
  });

  test("unauthenticated request", async () => {
    const res = await request(application).get("/foodentry");

    expect(res.status).toBe(403);
  });
});

describe("GET /foodentry/:id", () => {
  test("valid request", async () => {
    const res = await request(application)
      .get("/foodentry/1")
      .set("Authorization", userToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(expect.any(Array));
  });

  test("unauthenticated request", async () => {
    const res = await request(application).get("/foodentry/1");

    expect(res.status).toBe(403);
  });
});

describe("POST /foodentry", () => {
  let requestBody;

  beforeEach(() => {
    requestBody = {
      datetime: "2021-09-07T11:25:23.711Z",
      food: "Burger",
      calories: 650,
    };
  });

  test("valid data", async () => {
    const res = await request(application)
      .post("/foodentry")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(201);
  });

  test("body without datetime", async () => {
    delete requestBody.datetime;
    const res = await request(application)
      .post("/foodentry")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "DateTime, Food and Calories are mandatory fields."
    );
  });

  test("body without food", async () => {
    delete requestBody.food;
    const res = await request(application)
      .post("/foodentry")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "DateTime, Food and Calories are mandatory fields."
    );
  });

  test("body without calories", async () => {
    delete requestBody.calories;
    const res = await request(application)
      .post("/foodentry")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "DateTime, Food and Calories are mandatory fields."
    );
  });

  test("Non-Admin passing user_id", async () => {
    requestBody.user_id = 5;
    const res = await request(application)
      .post("/foodentry")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "Only Admin user can provide User ID while creating FoodEntry."
    );
  });

  test("food with only spaces", async () => {
    requestBody.food = "   ";
    const res = await request(application)
      .post("/foodentry")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Food should have a non-empty input.");
  });

  test("food with more than 100 characters", async () => {
    requestBody.food = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim";
    const res = await request(application)
      .post("/foodentry")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Maximum allowed length for food is 100 characters.");
  });

  test("datetime which is future dated", async () => {
    requestBody.datetime = moment().add(1, "days").toISOString();
    const res = await request(application)
      .post("/foodentry")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Date/Time cannot be future dated.");
  });

  test("calories as text", async () => {
    requestBody.calories = "abc";
    const res = await request(application)
      .post("/foodentry")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Calories should be a number.");
  });

  test("calories as a negative number", async () => {
    requestBody.calories = -50;
    const res = await request(application)
      .post("/foodentry")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Calories value should be greater than 0.");
  });

  test("unauthenticated request", async () => {
    requestBody.calories = -50;
    const res = await request(application).post("/foodentry").send(requestBody);

    expect(res.status).toBe(403);
  });
});

describe("PUT /foodentry/:id", () => {
  let requestBody;

  beforeEach(() => {
    requestBody = {
      datetime: "2021-09-07T11:25:23.711Z",
      food: "Burger",
      calories: 650,
    };
  });

  test("valid request", async () => {
    const res = await request(application)
      .put("/foodentry/1")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(200);
  });

  test("empty request body", async () => {
    delete requestBody.datetime;
    delete requestBody.food;
    delete requestBody.calories;

    const res = await request(application)
      .put("/foodentry/1")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Nothing to update.");
  });

  test("food with only spaces", async () => {
    requestBody.food = "  ";

    const res = await request(application)
      .put("/foodentry/1")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Food should have a non-empty input.");
  });

  test("food with more than 100 characters", async () => {
    requestBody.food = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim";

    const res = await request(application)
      .put("/foodentry/1")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Maximum allowed length for food is 100 characters.");
  });

  test("Non-Admin user passing user_id", async () => {
    requestBody.user_id = 10;

    const res = await request(application)
      .put("/foodentry/1")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "Only Admin user can provide User ID while updating FoodEntry."
    );
  });

  test("calories as text", async () => {
    requestBody.calories = "abc";

    const res = await request(application)
      .put("/foodentry/1")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Calories should be a number.");
  });

  test("calories as a negative number", async () => {
    requestBody.calories = -60;

    const res = await request(application)
      .put("/foodentry/1")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Calories value should be greater than 0.");
  });

  test("datetime as a future dated value", async () => {
    requestBody.datetime = moment().add(1, "days").toISOString();

    const res = await request(application)
      .put("/foodentry/1")
      .send(requestBody)
      .set("Authorization", userToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Date/Time cannot be future dated.");
  });

  test("unauthenticated request", async () => {
    const res = await request(application)
      .put("/foodentry/1")
      .send(requestBody);

    expect(res.status).toBe(403);
  });
});

describe("DELETE /foodentry/:id", () => {
    test("valid request", async () => {
      const res = await request(application)
        .delete("/foodentry/1")
        .set("Authorization", userToken);
  
      expect(res.status).toBe(200);

      await db_insertTestData(); 
      
    });
  
    test("unauthenticated request", async () => {
      const res = await request(application).delete("/foodentry/1");
  
      expect(res.status).toBe(403);
    });
  });