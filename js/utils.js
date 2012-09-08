
    function formatNumber(num,prefix){
        
        prefix = prefix || '';
        num += '';

        var splitStr = num.split('.');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '.00';
        var regx = /(\d+)(\d{3})/;

        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
        }

        if(splitLeft == undefined || splitLeft == null || splitLeft == '')
            splitLeft = '0';


        return prefix + splitLeft + splitRight;
    }

    function unformatNumber(num){
        return num.replace(/([^0-9.-])/g,'')*1;
    }

    //Sobrecargar la función Round para que soporte a Dos decimales

    var _round = Math.round;

    Math.round = function(number, decimals)
    {
        if(arguments.length == 1){
            return _round(number);
        }

        multiplier = Math.pow(10, decimals);
        return _round(number * multiplier)/multiplier;
    }
