"use stricts";
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const url = require("./variables").url;

describe("Login test: ", () => {
  it("El usuario se debe loguear satisfactoriamente y contener el token, también las demás propiedades en la respuesta.", (done) => {
    chai
      .request(url)
      .post("/api/authentication/login")
      .send({
        username: "test_user",
        password: "test123!",
      })
      .end(function (err, res) {
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("username");
        expect(res.body).to.have.property("user_id");
        expect(res.body).to.have.property("role");
        done();
      });
  });
});
