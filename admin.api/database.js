/**
 * Created by David on 2018.02.26..
 */
//Aktualis felhasznalok
    //Name: admin, Password: admin1234


var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    dataStoreURL = "mongodb://localhost:27017/admin-interface",
    dataStore = mongoose.createConnection(dataStoreURL, {safe: true}),
    sessionStore = mongoose.createConnection("mongodb://localhost:27017/admin-interface-session", {safe: true}),
    bcrypt = require("bcrypt"),     //Jelszo elkodolashoz
    SALT_WORK_FACTOR = 10,

    Constants = require("./constants");



//----------------------------------------------------------------------------
//----------------------------------- Sema -----------------------------------
//----------------------------------------------------------------------------
var Schemas = {
    User: new Schema({
        //_id --> alapbol general, igy nem kell kulon
        name: { type: String, required: true},
        email: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        role: {type: String, enum: [Constants.Roles.ADMIN, Constants.Roles.MODERATOR, Constants.Roles.USER], required: true},
        flag: {
            toxic: {
                value: {type: Boolean, default: false},
                byWho: [{_id: {type: Schema.Types.ObjectId}}]
            }
        },
        warn: [new Schema({
            message: {type: String}
        }, {_id: false})],
        ban: {type: Date, default: null}
    })
};

//Minden uj felhasznalo felvetele elott elkodoljuk a jelszot (csak a save() -re hivodik ez meg, az update() -re nem)
Schemas.User.pre("save", function(next){
    var user = this;

    //Csak akkor hash -elunk ha a jelszo uj, vagy modositva lett
    if (!user.isModified("password")) {
        return next();
    }

    //Letrehozzuk az extra tartalmat (salt) a jelszohoz
    bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt) {
        if (error) {
            return next(error);
        }

        //A jelszot hash -eljuk a salt -al egyutt
        bcrypt.hash(user.password, salt, function(error, hash) {
            if (error) {
                return next(error);
            }

            //Felulirjuk az eredeti jelszot
            user.password = hash;
            next();
        });
    });
});



//-----------------------------------------------------------------------------
//----------------------------------- Model -----------------------------------
//-----------------------------------------------------------------------------
var Models = {
    Users: dataStore.model("Users", Schemas.User)
};



//----------------------------------------------------------------------------
//--------------------------- Adatbazis fuggvenyei ---------------------------
//----------------------------------------------------------------------------
var DatabaseMethods = {
    User: {
        //---------------------------------------------------------
        //----------------------- Altalanos -----------------------
        //---------------------------------------------------------
        addUser: function (data, callback) {
            Models.Users.create({name: data.name, email: data.email, password: data.password, role: data.role}, function (error, user) {
                if (error) {
                    callback(new Helpers.DatabaseAnswer(null, error));
                }
                else {
                    //console.log(user + " has been created");
                    callback(new Helpers.DatabaseAnswer(user));
                }
            });
        },

        removeUser: function (data, callback) {
            Models.Users.deleteOne({email: data.email}, function (error) {
                if (error) {
                    callback(new Helpers.DatabaseAnswer(false, error));
                }
                else {
                    callback(new Helpers.DatabaseAnswer(true));
                }
            });
        },

        isValidUser: function(user, callback){
            Models.Users.findOne({email: user.email}, function(error, foundUser){
                if(error){
                    console.log(error);
                    callback(new Helpers.DatabaseAnswer(false, error));
                }
                else{
                    if(foundUser){
                        //Megnezzuk, hogy egyezik e a jelszo
                        bcrypt.compare(user.password, foundUser.password, function(error, isMatch) {
                            if(error){
                                console.log(error);
                                callback(new Helpers.DatabaseAnswer(false, error));
                            }
                            else{
                                //Adminnak vagy moderatornak kell lennie a felhasznalonak
                                if(foundUser.role === Constants.Roles.ADMIN || foundUser.role === Constants.Roles.MODERATOR){
                                    callback(new Helpers.DatabaseAnswer({isValid: isMatch, user: foundUser}));
                                }
                                else{
                                    callback(new Helpers.DatabaseAnswer({isValid: false, user: foundUser}));
                                }
                            }
                        });
                    }
                    else{
                        callback(new Helpers.DatabaseAnswer(false));
                    }
                }
            });
        },

        isValidSession: function(request, callback){
            sessionStore.collection("sessions").findOne({"_id": request.session.id}, function(error, result){
                if(error){
                    console.log(error);
                    callback(new Helpers.DatabaseAnswer(false, error));
                }
                else{
                    if(result){
                        var session = JSON.parse(result.session);

                        if(session.email === request.session.email && session.key === request.session.key){
                            callback(new Helpers.DatabaseAnswer(true));
                        }
                        else{
                            callback(new Helpers.DatabaseAnswer(false));
                        }
                    }
                    else{
                        callback(new Helpers.DatabaseAnswer(false));
                    }
                }
            });
        },

        isAdmin: function(email, callback){
            Models.Users.findOne({email: email}, function(error, foundUser){
                if(error){
                    console.log(error);
                    callback(new Helpers.DatabaseAnswer(false, error));
                }
                else{
                    callback(new Helpers.DatabaseAnswer(foundUser && foundUser.role === Constants.Roles.ADMIN));
                }
            });
        },

        isBanned: function(email, callback){
            Models.Users.findOne({email: email}, function(error, foundUser){
                if(error){
                    console.log(error);
                    callback(new Helpers.DatabaseAnswer(null, error));
                }
                else{
                    callback(new Helpers.DatabaseAnswer({isBanned: foundUser && foundUser.ban !== null, end: foundUser.ban}));
                }
            });
        },

        logout: function(request, callback){
            sessionStore.collection("sessions").remove({"_id": request.session.id}, function(error, result){
                if(error){
                    console.log(error);
                    callback(new Helpers.DatabaseAnswer(null, error));
                }
                else{
                    //Hanyat torolt
                    callback(new Helpers.DatabaseAnswer(result));
                }
            });
        },


        //---------------------------------------------------------
        //---------------- Utvonalakhoz kapcsolodo ----------------
        //---------------------------------------------------------
        getUserById: function(data, callback){
            Models.Users.findOne({_id: data._id}, function(error, foundUser){
                if(error){
                    console.log(error);
                    callback(new Helpers.DatabaseAnswer(null, error));
                }
                else{
                    if(foundUser){
                        callback(new Helpers.DatabaseAnswer(foundUser));
                    }
                    else{
                        callback(new Helpers.DatabaseAnswer(null, "User cannot be found!"));
                    }
                }
            });
        },

        getUserByEmail: function(data, callback){
            Models.Users.findOne({email: data.email}, function(error, foundUser){
                if(error){
                    console.log(error);
                    callback(new Helpers.DatabaseAnswer(null, error));
                }
                else{
                    if(foundUser){
                        callback(new Helpers.DatabaseAnswer(foundUser));
                    }
                    else{
                        callback(new Helpers.DatabaseAnswer(null, "User cannot be found!"));
                    }
                }
            });
        },

        getUsers: function(callback){
            Models.Users.find({}, function(error, users){
                if (error) {
                    callback(new Helpers.DatabaseAnswer(null, error));
                }
                else {
                    callback(new Helpers.DatabaseAnswer(users));
                }
            });
        },

        banUser: function(data, callback){
            Models.Users.findOne({_id: data._id}, function(error, foundUser){
                if(error){
                    console.log(error);
                    callback(new Helpers.DatabaseAnswer(null, error));
                }
                else{
                    if(foundUser){
                        foundUser.ban = data.date;

                        //Toroljuk az esetleges flag -eket
                        for(var key in foundUser.flags){
                            if(foundUser.flag.hasOwnProperty(key)) {
                                foundUser.flag[key].value = false;
                                foundUser.flag[key].byWho = [];
                            }
                        }

                        foundUser.save(function(error, updatedUser){
                            if(error){
                                console.log(error);
                                callback(new Helpers.DatabaseAnswer(null, error));
                            }
                            else{
                                callback(new Helpers.DatabaseAnswer(updatedUser));
                            }
                        });
                    }
                    else{
                        callback(new Helpers.DatabaseAnswer(null, "User cannot be found!"));
                    }
                }
            });
        },

        warnUser: function(data, callback){
            Models.Users.findOne({_id: data._id}, function(error, foundUser){
                if(error){
                    console.log(error);
                    callback(new Helpers.DatabaseAnswer(null, error));
                }
                else{
                    if(foundUser){
                        console.log({message: data.message});
                        foundUser.warn.push({message: data.message});

                        foundUser.save(function(error, updatedUser){
                            if(error){
                                console.log(error);
                                callback(new Helpers.DatabaseAnswer(null, error));
                            }
                            else{
                                callback(new Helpers.DatabaseAnswer(updatedUser));
                            }
                        });
                    }
                    else{
                        callback(new Helpers.DatabaseAnswer(null, "User cannot be found!"));
                    }
                }
            });
        },

        editUser: function(newUserData, callback){
            Models.Users.findOne({_id: newUserData._id}, function(error, foundUser){
                if(error){
                    console.log(error);
                    callback(new Helpers.DatabaseAnswer(null, error));
                }
                else{
                    if(foundUser){
                        foundUser.name = newUserData.name;
                        foundUser.email = newUserData.email;
                        foundUser.password = newUserData.password;
                        foundUser.role = newUserData.role;

                        foundUser.save(function(error, updatedUser){
                            if(error){
                                console.log(error);
                                callback(new Helpers.DatabaseAnswer(null, error));
                            }
                            else{
                                callback(new Helpers.DatabaseAnswer(updatedUser));
                            }
                        });
                    }
                    else{
                        callback(new Helpers.DatabaseAnswer(null, "User cannot be found!"));
                    }
                }
            });
        },

        removeFlag: function(data, callback){

            //TODO

        }
    },



    Others: {
        cleanUpSessionStore: function(){
            sessionStore.collection("sessions").drop(function(error){
                console.log("Sessions removed");
                process.exit();
            });
        }
    }
};



//----------------------------------------------------------------------------
//------------------------------- Seged dolgok -------------------------------
//----------------------------------------------------------------------------
var Helpers = {
    DatabaseAnswer: function(result, error){
        this.result = result;
        this.error = error;
    }
};



//----------------------------------------------------------------------------
//---------------------------------- Export ----------------------------------
//----------------------------------------------------------------------------
module.exports = {
    DatabaseMethods: DatabaseMethods,
    sessionStore: sessionStore
};