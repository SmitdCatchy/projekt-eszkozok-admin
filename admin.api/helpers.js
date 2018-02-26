/**
 * Created by David on 2018.02.26..
 */
module.exports.Functions = {
    keyGenerator: function(){
        var key = "",
            letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
            lettersLength = letters.length,
            numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            numbersLength = numbers.length;

        for(var i=0; i<24; i++){
            var letterOrNumber = Math.random();
            var one = 0;

            if(letterOrNumber<0.5){
                //Betuk
                var smallOrBig = Math.random();

                if(smallOrBig<0.5){
                    //Kicsi
                    one = Math.round(Math.random() * (lettersLength - 1)); //Alapjaiban hozzakene meg a hosszhoz adni 1 -et, ami mivel tombokrol van szo ami 0 -tol kezdodik, igy le kell vonni (kulonben 1 undefined is lehetne)
                    key += letters[one];
                }
                else{
                    //Nagy
                    one = Math.round(Math.random() * (lettersLength - 1));
                    key += letters[one].toUpperCase();
                }
            }
            else{
                //Szamok
                one = Math.round(Math.random() * (numbersLength - 1));
                key += numbers[one];
            }
        }
        return key;
    }
};