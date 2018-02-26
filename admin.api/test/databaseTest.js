/**
 * Created by David on 2018.02.26..
 */

var chai = require("chai"),
    expect = chai.expect,
    Database = require("../database");

before(function(done){
    Database.DatabaseMethods.User.removeUser({email: '__test@test.com'}, function(){done()});
});

describe("---- Creating user 1 ----", function() {
    it("A user with the following attributes should be created - {name: '__test', email: '__test@test.com', password: '__test', role: 'admin'}", function(done) {
        Database.DatabaseMethods.User.addUser({name: '__test', email: '__test@test.com', password: '__test', role: 'admin'}, function(DatabaseAnswer){
            console.log(DatabaseAnswer.result);
            expect(DatabaseAnswer.result).to.not.be.null;
            done();
        });
    });
});

describe("---- Get user by email ----", function() {
    it("A user with the following attributes should be returned - {name: '__test', email: '__test@test.com', password: '__test', role: 'admin'}", function(done) {
        Database.DatabaseMethods.User.getUserByEmail({email: '__test@test.com'}, function(DatabaseAnswer){
            console.log(DatabaseAnswer.result);
            expect(DatabaseAnswer.result).to.not.be.null;
            done();
        });
    });
});

describe("---- User validation ----", function() {
    it("The user should be valid for logging in.", function(done) {
        Database.DatabaseMethods.User.isValidUser({email: '__test@test.com', password: '__test'}, function(DatabaseAnswer){
            expect(DatabaseAnswer.result.isValid).to.be.true;
            done();
        });
    });
});

describe("---- User is admin ----", function() {
    it("The user should be an admin.", function(done) {
        Database.DatabaseMethods.User.isAdmin('__test@test.com', function(DatabaseAnswer){
            expect(DatabaseAnswer.result).to.be.true;
            done();
        });
    });
});

describe("---- Ban user ----", function() {
    it("The user should have a ban date and the flags should be cleared.", function(done) {
        Database.DatabaseMethods.User.getUserByEmail({email: '__test@test.com'}, function(DatabaseAnswer){
            var today = new Date(),
                tomorrow = today.setDate(today.getDate() + 1);

            Database.DatabaseMethods.User.banUser({_id: DatabaseAnswer.result._id, date: tomorrow}, function(DatabaseAnswer){
                console.log(DatabaseAnswer.result);
                expect(DatabaseAnswer.result).to.not.be.null;
                done();
            });
        });
    });
});

describe("---- Warn user ----", function() {
    it("The user should have a warning.", function(done) {
        Database.DatabaseMethods.User.getUserByEmail({email: '__test@test.com'}, function(DatabaseAnswer){

            Database.DatabaseMethods.User.warnUser({_id: DatabaseAnswer.result._id, message: "Test warning!"}, function(DatabaseAnswer){
                console.log(DatabaseAnswer.result);
                expect(DatabaseAnswer.result).to.not.be.null;
                done();
            });
        });
    });
});

describe("---- Edit user ----", function() {
    it("The user should have a different name and password.", function(done) {
        Database.DatabaseMethods.User.getUserByEmail({email: '__test@test.com'}, function(DatabaseAnswer){
            console.log("Old user: " + DatabaseAnswer.result);

            DatabaseAnswer.result.name = "__NewTest";
            DatabaseAnswer.result.password = "__NewTestPassword";

            Database.DatabaseMethods.User.editUser(DatabaseAnswer.result, function(DatabaseAnswer){
                console.log("New user: " + DatabaseAnswer.result);
                expect(DatabaseAnswer.result).to.not.be.null;
                done();
            });
        });
    });
});

describe("---- Remove user 1 ----", function() {
    it("A user with the following attributes should be removed - {email: '__test@test.com'}", function(done) {
        Database.DatabaseMethods.User.removeUser({email: '__test@test.com'}, function(DatabaseAnswer){
            expect(DatabaseAnswer.result).to.be.true;
            done();
        });
    });
});

describe("---- Creating user 2 ----", function() {
    it("User should not be created with invalid role (possible values: admin, moderator, user) - {name: '__test2', email: '__test2@test.com', password: '__test2', role: 'alma'}", function(done) {
        Database.DatabaseMethods.User.addUser({name: '__test2', email: '__test2@test.com', password: '__test2', role: 'alma'}, function(DatabaseAnswer){
            expect(DatabaseAnswer.result).to.be.null;
            done();
        });
    });
});