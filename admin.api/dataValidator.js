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
        return new this.ReturnMessage(data.date > new Date(), "Ban date must be after this day!");
    },

    validateWarn: function(data){
        if(!data.message){
            return new this.ReturnMessage(false, "Warn message is missing!");
        }
        else{
            return new this.ReturnMessage(true);
        }
    },

    validateUserData: function(user){
        //Email ellenorzes
        var check = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

        return check.test(user.email);
    }
};