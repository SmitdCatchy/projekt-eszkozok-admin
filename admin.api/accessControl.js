/**
 * Created by David on 2018.02.26..
 */
var Database = require("./database"),
    Constants = require("./constants"),
    Helpers = require("./helpers");

module.exports = {
    //Belepeskor a hitelesites.
    authenticate: function(req, res){
        var data = req.body;

        if(!data.email || !data.password){
            res.send({error: "Missing email or password"});
        }
        else{
            Database.DatabaseMethods.User.isValidUser(data, function(answer){
                if(!answer.result.isValid){
                    if(answer.error){
                        res.sendStatus(500);
                    }
                    //Nem megfelelo a nev/jelszo
                    else{
                        //res.redirect("/login");
                        //res.send({error: "Email or password is not correct!"});
                        res.status(401).send({redirect: "/login"});
                    }
                }
                else{
                    //Ha moderatorrol van szo, akkor megnezzuk, hogy nincs e bannolva
                    if(answer.result.user.role === Constants.Roles.MODERATOR){
                        Database.DatabaseMethods.User.isBanned(data.email, function(DatabaseAnswer){
                            if(DatabaseAnswer.result){
                                if(!DatabaseAnswer.result.isBanned){
                                    req.session.email = data.email;
                                    req.session.key = Helpers.Functions.keyGenerator();

                                    res.redirect("/");
                                }
                                else{
                                    //res.send({error: "You are banned, until " + DatabaseAnswer.result.end});
                                    res.status(403).send({redirect: "/login"});
                                }
                            }
                            else{
                                //res.redirect("/login");
                                //res.send({error: DatabaseAnswer.error});
                                res.status(409).send({redirect: "/login"});
                            }
                        });
                    }
                    else{
                        req.session.email = data.email;
                        req.session.key = Helpers.Functions.keyGenerator();

                        res.redirect("/");
                    }
                }
            });
        }
    },

    isAuthenticated: function(req, res, callback){
        if(req.session && req.session.email && req.session.key){
            Database.DatabaseMethods.User.isValidSession(req, function(answer){
                if(answer.result){
                    callback(true);
                }
                else{
                    if(answer.error){
                        res.sendStatus(500);
                    }
                    else{
                        callback(false);
                    }
                }
            });
        }
        else{
            callback(false);
        }
    },

    logout: function(req, res){
        Database.DatabaseMethods.User.logout(req, function(answer){
            if(answer.error){
                res.sendStatus(500);
            }
            else{
                req.session.cookie.maxAge = 1; //1 ezred masodperc mulva torlodik a geprol is a suti.
                req.session.destroy();
            }
        });
    }
};