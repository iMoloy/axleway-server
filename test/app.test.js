import assert from "node:assert/strict";
import app from "../src/index.js";

const response = await app.inject({ method: "GET", url: "/" });
assert.equal(response.statusCode, 200);
console.log("health-check-ok");
