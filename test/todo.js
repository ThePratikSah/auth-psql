import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";

// assertion style
chai.should();

chai.use(chaiHttp);

describe("Todo API", () => {
  /**
   * testing the GET todos route
   */
  describe("GET /todos/", () => {
    it("should get all the todos", (done) => {
      chai
        .request(app)
        .get("/todos")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.todo.should.be.a("array");
          done();
        });
    });
  });

  /**
   * testing the GET (by id) route
   */
  describe("GET /todos/4", () => {
    it("should get all the todos", (done) => {
      chai
        .request(app)
        .get("/todos/4")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.todo.should.be.a("object");
          res.body.should.have.property("todo");
          done();
        });
    });
  });

  /**
   * testing the POST /todos route
   */
  describe("POST /todos", () => {
    it("should add a new todos in the db", (done) => {
      const data = {
        title: "Create a REST API",
      };
      chai
        .request(app)
        .post("/todos")
        .send(data)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property("todo");
          res.body.todo.should.be.a("object");
          done();
        });
    });
  });

  /**
   * testing the PATCH /todos route
   */
  describe("PATCH /todos/4", () => {
    it("should update the todos in the db with id 4", (done) => {
      const data = {
        title: "Something new for the title",
      };
      chai
        .request(app)
        .patch("/todos/4")
        .send(data)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property("response");
          res.body.response.should.be.eq("Updated");
          done();
        });
    });
  });

  /**
   * testing the DELETE /todos/5 route
   */
  describe("DELETE /todos/6", () => {
    it("should delete the todo in the db with id 6", (done) => {
      chai
        .request(app)
        .delete("/todos/6")
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property("response");
          res.body.response.should.be.eq("Deleted");
          done();
        });
    });
  });
});
