/**
 * Created by David on 2018.02.26..
 */

//----------------------------------------------------------------------------
//-------------------------------- Fuggosegek --------------------------------
//----------------------------------------------------------------------------
var express = require("express"),
    session = require("express-session"), //Belepeshez/hitelesiteshez
    cookieParser = require("cookie-parser"), //Belepeshez/hitelesiteshez
    sessionStore = require("connect-mongo")(session),
    bodyParser = require("body-parser"),
    http = require("http"),
    path = require("path"),
    mongoose = require("mongoose");



//----------------------------------------------------------------------------
//----------------------------- Importalt fajlok -----------------------------
//----------------------------------------------------------------------------
var Database = require("./database"),
    AccessControl = require("./accessControl"),
    DataValidator = require("./dataValidator");



//-----------------------------------------------------------------------------
//-------------------------------- Beallitasok --------------------------------
//-----------------------------------------------------------------------------
var Settings = {
    port: 3000,
    secret: "T8V74-284R7-4RZ9746NTR-N248Z-ZCZ2U-8V43R-U29UR-R9M28-R24URV82U4"
};



var app = express(),
    server = http.Server(app);



//-----------------------------------------------------------------------------
//----------------------------- Session beallitas -----------------------------
//-----------------------------------------------------------------------------
var sessionMiddleware = session({
    store: new sessionStore({
        mongooseConnection: Database.sessionStore,
        ttl: 3600 //A suti lejarati ideje (automatikusan frissul, ha kapcsolatbalepunk a szerverrel, tehat megint 1 ora lesz, ez gyakorlatilag a maxAge, csak jobb)
    }),
    secret: Settings.secret,
    resave: false,
    saveUninitialized: false //Ha a MongoDB a session tar, akkor jo a false, mivel van touch method tamogatasa.
});



//-----------------------------------------------------------------------------
//---------------------------- Express beallitasai ----------------------------
//-----------------------------------------------------------------------------
app.use(bodyParser.json({limit: "15mb"}));
app.use(bodyParser.urlencoded({limit: "15mb", extended: true}));
app.use(cookieParser(Settings.secret));
app.use(sessionMiddleware);

//Elerhetove tesszuk az alkalmazast
app.use(express.static(path.resolve(__dirname + "/../dist")));



//-----------------------------------------------------------------------------
//--------------------------------- Utvonalak ---------------------------------
//-----------------------------------------------------------------------------
//--------------------------------------------------
//-------------------- Publikus --------------------
//--------------------------------------------------
app.get("/", function(req, res){
    res.sendFile(path.resolve(__dirname + "/../dist/index.html"));
});

app.post("/api/login", function(req, res){
    AccessControl.isAuthenticated(req, res, function(isAuthenticated){
        //Ha megint belepne, ugy hogy mar bevan, akkor csak atiranyitjuk
        if(isAuthenticated){
            res.redirect("/");
        }
        else{
            AccessControl.authenticate(req, res);
        }
    });
});

app.post("/api/logout", function(req, res){
    AccessControl.logout(req, res);
    res.redirect("/login");
});




//--------------------------------------------------
//--------------------- Privat ---------------------
//--------------------------------------------------
//Minden keres, ami az /api/... utvonalra erkezik bejelentkezest igenyel
function isLoggedIn(req, res, next){
    AccessControl.isAuthenticated(req, res, function(isAuthenticated){
        if(isAuthenticated){
            next();
        }
        else{
            res.redirect("/login");
        }
    });
}

app.use("/api", isLoggedIn);

app.get("/api/users", function(req, res){
    Database.DatabaseMethods.User.getUsers(function(DatabaseAnswer){
        res.send(DatabaseAnswer);
    });
});

app.get("/api/user", function(req, res){
    Database.DatabaseMethods.User.getUserById(req.body, function(DatabaseAnswer){
        res.send(DatabaseAnswer);
    });
});

app.post("/api/ban", function(req, res){
    var validation = DataValidator.validateBan(req.body);

    if(!validation.isValid){
        res.send({result: null, error: validation.errorMessage});
        return;
    }

    Database.DatabaseMethods.User.banUser(req.body, function(DatabaseAnswer){
        res.send(DatabaseAnswer);
    });
});

app.post("/api/warn", function(req, res){
    var validation = DataValidator.validateWarn(req.body);

    if(!validation.isValid){
        res.send({result: null, error: validation.errorMessage});
        return;
    }

    Database.DatabaseMethods.User.warnUser(req.body, function(DatabaseAnswer){
        res.send(DatabaseAnswer);
    });
});

app.post("/api/edit", function(req, res){
    Database.DatabaseMethods.User.isAdmin(req.session.email, function(DatabaseAnswer){
        if(DatabaseAnswer.result){
            var validation = DataValidator.validateUserData(req.body);

            if(!validation.isValid){
                res.send({result: null, error: validation.errorMessage});
                return;
            }

            Database.DatabaseMethods.User.editUser(req.body, function(DatabaseAnswer){
                res.send(DatabaseAnswer);
            });
        }
        else{
            res.redirect("/login");
        }
    });
});



//--------------------------------------------------
//------------------ Minden egyeb ------------------
//--------------------------------------------------
app.get("*", function(req, res){
    res.sendStatus(404);
});



//-----------------------------------------------------------------------------
//------------------------------- Leallas elott -------------------------------
//-----------------------------------------------------------------------------
process.stdin.resume(); //Igy nem all le rogton a szerver

//Normalis leallas eseten
process.on('exit', function(){
    Database.DatabaseMethods.Others.cleanUpSessionStore();
});

//Ctrl+C eseten
process.on('SIGINT', function(){
    Database.DatabaseMethods.Others.cleanUpSessionStore();
});

//El nem fogott kivetel eseten
process.on('uncaughtException', function(error){
    console.log(error);
    Database.DatabaseMethods.Others.cleanUpSessionStore();
});



//----------------------------------------------------------------------------
//----------------------------- Szerver inditasa -----------------------------
//----------------------------------------------------------------------------
server.listen(Settings.port, function(){
    console.log("Server is listening on port: " + Settings.port);
});

//Teszteleshez
module.exports = server;