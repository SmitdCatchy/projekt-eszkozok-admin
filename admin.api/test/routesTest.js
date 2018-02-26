/**
 * Created by David on 2018.02.26..
 */

var expect = require("chai").expect,
    request = require("supertest"),

    App = require("../app"),
    Database = require("../database"),

    userData = {name: "admin", email: "admin@admin.com", password: "admin1234", role: "admin"},
    loggedInUser = request.agent(App);

//Elobb belepunk
before(function(done){
    loggedInUser
        .post("/api/login")
        .send(userData)
        .end(function(err, response){
            expect("Location", '/');
            done();
        });
});

describe("---- Testing routes as admin ----", function() {
    it("GET /api/users", function(done) {
        loggedInUser
            .get("/api/users")
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/, done);
    });
});