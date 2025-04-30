import {expect} from "chai";
import httpStatus from "http-status-codes";
import {RoleName} from "../../../common/scopes.js";

const kDefaultPassword = "admin";
const kAuthPrefix = "/v1/auth";

const TestUsers = [
  {
    // username: "unlinked",
    // email: "unlinked@mudspring.uplb.edu.ph",
    username: "unlinked@mudspring.uplb.edu.ph",
    password: kDefaultPassword,
    roleName: RoleName.UNLINKED,
    isActive: false
  },
  {
    // username: "alumnus",
    // email: "alumnus@mudspring.uplb.edu.ph",
    username: "alumnus@mudspring.uplb.edu.ph",
    password: kDefaultPassword,
    roleName: RoleName.ALUMNUS,
    isActive: true
  },
  {
    // username: "moderator",
    // email: "moderator@mudspring.uplb.edu.ph",
    username: "moderator@mudspring.uplb.edu.ph",
    password: kDefaultPassword,
    roleName: RoleName.MODERATOR,
    isActive: true
  },
  {
    // username: "admin",
    // email: "admin@mudspring.uplb.edu.ph",
    username: "admin@mudspring.uplb.edu.ph",
    password: kDefaultPassword,
    roleName: RoleName.ADMIN,
    isActive: true
  }
];

TestUsers.unlinked = TestUsers[0];
TestUsers.alumnus = TestUsers[1];
TestUsers.moderator = TestUsers[2];
TestUsers.admin = TestUsers[3];

async function TestSignIn(aAgent, aCredentials) {
  const res = await aAgent
    .post(`${kAuthPrefix}/sign-in`)
    .send(aCredentials);

  expect(res.status).to.equal(httpStatus.OK);
}

async function TestSignOut(aAgent) {
  const res = await aAgent.post(`${kAuthPrefix}/sign-out`);

  expect(res.status).to.equal(httpStatus.OK);
  expect(res.body).to.have.property("status", "OK");
}

export {TestSignIn, TestSignOut, TestUsers};