/**
 * Created by David on 2018.02.26..
 */

var expect = require("chai").expect,
    request = require("supertest"),

    App = require("../app"),
    Database = require("../database"),

    adminUser = {name: "__admin", email: "__admin@admin.com", password: "__admin", role: "admin"},
    moderatorUser1 = {name: "__moderator1", email: "__moderator1@moderator.com", password: "__moderator1", role: "moderator"},
    moderatorUser2 = {name: "__moderator2", email: "__moderator2@moderator.com", password: "__moderator2", role: "moderator"},
    normalUser1 = {name: "__normalUser1", email: "__normalUser1@normalUser.com", password: "__normalUser1", role: "user"},
    normalUser2 = {name: "__normalUser2", email: "__normalUser2@admin.com", password: "__normalUser2", role: "user"},
    loggedInUser = request.agent(App);


describe("---- Testing routes as admin ----", function() {
    //Ha a database tesztek sikeresek, felveszunk nehany felhasznalot
    before(function(done){
        Database.DatabaseMethods.User.removeUser(adminUser, function(DatabaseResult){
            Database.DatabaseMethods.User.removeUser(moderatorUser1, function(DatabaseResult){
                Database.DatabaseMethods.User.removeUser(moderatorUser2, function(DatabaseResult) {
                    Database.DatabaseMethods.User.removeUser(normalUser1, function (DatabaseResult) {
                        Database.DatabaseMethods.User.removeUser(normalUser2, function (DatabaseResult) {


                            Database.DatabaseMethods.User.addUser(adminUser, function (DatabaseResult) {
                                adminUser._id = DatabaseResult.result._id;
                                Database.DatabaseMethods.User.addUser(moderatorUser1, function (DatabaseResult) {
                                    moderatorUser1._id = DatabaseResult.result._id;
                                    Database.DatabaseMethods.User.addUser(moderatorUser2, function (DatabaseResult) {
                                        moderatorUser2._id = DatabaseResult.result._id;
                                        Database.DatabaseMethods.User.addUser(normalUser1, function (DatabaseResult) {
                                            normalUser1._id = DatabaseResult.result._id;
                                            Database.DatabaseMethods.User.addUser(normalUser2, function (DatabaseResult) {
                                                normalUser2._id = DatabaseResult.result._id;
                                                done();
                                            });
                                        });
                                    });
                                });
                            });


                        });
                    });
                });
            });
        });
    });



    it("POST - /api/login - Login as admin", function(done) {
        loggedInUser
            .post("/api/login")
            .send(adminUser)
            .end(function(err, response){
                expect(response.header.location).to.equal("/");
                done();
            });
    });

    it("GET - /api/users - Get all users", function(done) {
        loggedInUser
            .get("/api/users")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.not.be.null;
                done();
            });
    });

    it("POST - /api/user - Get normalUser1's data.", function(done) {
        loggedInUser
            .post("/api/user")
            .send(normalUser1)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.not.be.null;
                done();
            });
    });

    it("POST - /api/user - Get moderator's data.", function(done) {
        loggedInUser
            .post("/api/user")
            .send(moderatorUser1)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.not.be.null;
                done();
            });
    });

    it("POST - /api/ban - Should fail to invalid date.", function(done) {
        var today = new Date(),
            yesterday = today.setDate(today.getDate() - 1);

        loggedInUser
            .post("/api/ban")
            .send({_id: normalUser2._id, date: yesterday})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.be.null;
                done();
            });
    });

    it("POST - /api/ban - Should be ok, to ban the moderator.", function(done) {
        var today = new Date(),
            tomorrow = today.setDate(today.getDate() + 1);

        loggedInUser
            .post("/api/ban")
            .send({_id: moderatorUser1._id, date: tomorrow})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.not.be.null;
                done();
            });
    });

    it("POST - /api/warn - Should fail to missing message.", function(done) {
        loggedInUser
            .post("/api/warn")
            .send({_id: normalUser1._id})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.be.null;
                done();
            });
    });

    it("POST - /api/warn - User should get a warning message.", function(done) {
        loggedInUser
            .post("/api/warn")
            .send({_id: normalUser1._id, message: "Test warning."})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.not.be.null;
                expect(response.body.result.warn.length).to.equal(1);
                done();
            });
    });

    it("POST - /api/edit - Should fail to missing name.", function(done) {
        loggedInUser
            .post("/api/edit")
            .send({_id: normalUser1._id, /*name: "__normalUser1",*/ email: "__normalUser1@normalUser.com", password: "__normalUser1", role: "user"})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.be.null;
                done();
            });
    });

    it("POST - /api/edit - Should fail to missing email.", function(done) {
        loggedInUser
            .post("/api/edit")
            .send({_id: normalUser1._id, name: "__normalUser1", /*email: "__normalUser1@normalUser.com",*/ password: "__normalUser1", role: "user"})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.be.null;
                done();
            });
    });

    it("POST - /api/edit - Should fail to invalid email.", function(done) {
        loggedInUser
            .post("/api/edit")
            .send({_id: normalUser1._id, name: "__normalUser1", email: "__normalUser1normalUser.com", password: "__normalUser1", role: "user"})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.be.null;
                done();
            });
    });

    it("POST - /api/edit - Should fail to missing password.", function(done) {
        loggedInUser
            .post("/api/edit")
            .send({_id: normalUser1._id, name: "__normalUser1", email: "__normalUser1@normalUser.com", /*password: "__normalUser1",*/ role: "user"})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.be.null;
                done();
            });
    });

    it("POST - /api/edit - Should fail to missing role.", function(done) {
        loggedInUser
            .post("/api/edit")
            .send({_id: normalUser1._id, name: "__normalUser1", email: "__normalUser1@normalUser.com", password: "__normalUser1"/*, role: "user"*/})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.be.null;
                done();
            });
    });

    it("POST - /api/edit - User's name and role should be changed.", function(done) {
        loggedInUser
            .post("/api/edit")
            .send({_id: normalUser1._id, name: "__normalUser1.2", email: "__normalUser1@normalUser.com", password: "__normalUser1", role: "moderator"})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.not.be.null;
                expect(response.body.result.name).to.equal("__normalUser1.2");
                expect(response.body.result.role).to.equal("moderator");
                done();
            });
    });

    it("POST - /api/logout - Logout as admin", function(done) {
        loggedInUser
            .post("/api/logout")
            .send(adminUser)
            .end(function(err, response){
                expect(response.header.location).to.equal("/login");
                done();
            });
    });

    it("POST - /api/login - Login as the moderator should fail, due to the previous ban.", function(done) {
        loggedInUser
            .post("/api/login")
            .send(moderatorUser1)
            .end(function(err, response){
                expect(response.header.location).to.equal("/login");
                done();
            });
    });

    it("POST - /api/login - Login as moderator2", function(done) {
        loggedInUser
            .post("/api/login")
            .send(moderatorUser2)
            .end(function(err, response){
                expect(response.header.location).to.equal("/");
                done();
            });
    });

    it("POST - /api/edit - Moderator should not be able to edit the user's data.", function(done) {
        loggedInUser
            .post("/api/edit")
            .send({_id: normalUser1._id, name: "__normalUser1.2", email: "__normalUser1@normalUser.com", password: "__normalUser1", role: "moderator"})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end(function(err, response){
                expect(response.header.location).to.not.equal("/login");
                expect(response.body.result).to.be.null;
                done();
            });
    });

    it("POST - /api/logout - Logout as moderator2", function(done) {
        loggedInUser
            .post("/api/logout")
            .send(adminUser)
            .end(function(err, response){
                expect(response.header.location).to.equal("/login");
                done();
            });
    });



    //Ha vegeztunk toroljuk a felhasznalokat
    after(function(done){
        Database.DatabaseMethods.User.removeUser(adminUser, function(DatabaseResult){
            Database.DatabaseMethods.User.removeUser(moderatorUser1, function(DatabaseResult){
                Database.DatabaseMethods.User.removeUser(moderatorUser2, function(DatabaseResult){
                    Database.DatabaseMethods.User.removeUser(normalUser1, function(DatabaseResult){
                        Database.DatabaseMethods.User.removeUser(normalUser2, function(DatabaseResult){
                            done();
                        });
                    });
                });
            });
        });
    });
});