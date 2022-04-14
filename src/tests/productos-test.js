"use stricts";
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const url = require("./variables").url;
const token = require("./variables").token;

describe("Get productos: ", () => {
  it("Se debe obtener la lista de productos en la BD.", (done) => {
    chai
      .request(url)
      .get("/api/producto/list")
      .set({ Authorization: `Bearer ${token}` })
      .end(function (err, res) {
        console.log(Array.from(JSON.parse(res.text)));
        expect(res).to.have.status(200);
        expect(Array.from(JSON.parse(res.text))).to.be.an("array");
        done();
      });
  });
});

describe("Get producto: ", () => {
  it("Se debe obtener un producto determinado con todas sus propiedades.", (done) => {
    chai
      .request(url)
      .get("/api/producto/1")
      .set({ Authorization: `Bearer ${token}` })
      .end(function (err, res) {
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("nombre");
        expect(res.body).to.have.property("descripcion");
        done();
      });
  });
});
