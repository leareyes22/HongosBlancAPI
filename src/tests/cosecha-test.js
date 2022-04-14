"use stricts";
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const url = require("./variables").url;
const token = require("./variables").token;

describe("Post cosecha: ", () => {
  it("Se debe poder crear una cosecha", (done) => {
    chai
      .request(url)
      .post("/api/cosecha")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        fecha_cosechada: "2021-09-20 20:57:51",
        id_producto: 1,
        kg_cosechados: 60.5,
        observaciones: "La cosecha salió bien.",
        id_sala: 1,
        id_personal: 1,
        id_turno: 1,
      })
      .end(function (err, res) {
        console.log(res.text);
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("Get cosechas list : ", () => {
  it("Se debe obtener la lista de cosechas cargadas en la BD.", (done) => {
    chai
      .request(url)
      .get("/api/cosecha/list")
      .set({ Authorization: `Bearer ${token}` })
      .end(function (err, res) {
        console.log(Array.from(JSON.parse(res.text)));
        expect(res).to.have.status(200);
        expect(Array.from(JSON.parse(res.text))).to.be.an("array");
        done();
      });
  });
});
