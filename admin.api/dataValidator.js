/**
 * Created by David on 2018.02.26..
 */

//Ezen objektummal a klienstol beerkezo kulonfele adatokat validaljuk
module.exports = {
    ReturnMessage: function(isValid, errorMessage){
        this.isValid = isValid;
        this.errorMessage = errorMessage;
    },

    validateBan: function(data){
        if(!data.hasOwnProperty("date")){
            return new this.ReturnMessage(false, "Date is missing!");
        }
        else if(Date.parse(data.date) <= (new Date()).getTime()){
            return new this.ReturnMessage(false, "Ban date must be after this day!");
        }
        else{
            return new this.ReturnMessage(true);
        }
    },

    validateWarn: function(data){
        if(!data.hasOwnProperty("message")){
            return new this.ReturnMessage(false, "Warn message is missing!");
        }
        else{
            return new this.ReturnMessage(true);
        }
    },

    validateUserData: function(user){
        var emailCheck = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

        if(user.hasOwnProperty("name") && user.name === ""){
            return new this.ReturnMessage(false, "User's name is missing!");
        }
        else if(user.hasOwnProperty("email") && user.email === ""){
            return new this.ReturnMessage(false, "User's email is missing!");
        }
        else if(!emailCheck.test(user.email)){
            return new this.ReturnMessage(false, "Invalid email!");
        }
        else if(user.hasOwnProperty("password") && user.password === ""){
            return new this.ReturnMessage(false, "User's password is missing!");
        }
        else if(user.hasOwnProperty("role") && user.role === ""){
            return new this.ReturnMessage(false, "User's role is missing!");
        }
        else{
            return new this.ReturnMessage(true);
        }
    }
};