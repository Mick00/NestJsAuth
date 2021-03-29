import { Session } from "../src/authentication/session.entity";
import { User } from "../src/users/user.entity";

describe("session to pojo", () => {
  it("session to pojo", () => {
    const session = new Session();
    session.start();
    const user = new User();
    user.username = "test";
    session.user = Promise.resolve(user);

    const pojo = Object.getOwnPropertyNames(session).reduce((obj, key) => {
      obj[key] = session[key];
      return obj;
    }, {});
    console.log(pojo);
    expect("test").toEqual("test");
  });
});
