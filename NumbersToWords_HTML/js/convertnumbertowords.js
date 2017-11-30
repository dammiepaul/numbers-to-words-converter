//! convertNumberToWords.js
//! version : 1.0.0
//! author : Damilare Paul Ayodele
//! copyright 2011-2016
//! license : MIT
//! Use, reproduction, distribution, and modification of this code is subject to the terms and
//! conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
//! dammiepaul.wordpress.com

var ConvertNumber = {};

ConvertNumber.toWords = function convertNumberToWords(numberToConvert, options) {
        
    //Set default values for optional parameters
    options = options || {};
    var mode = options.mode || "counting";  //mode is optional. Default value = "counting". Other value could be "financial"
    var currencyName = options.currencyName || "naira";     //currencyName is optional. Default value = "naira"
    var unit = options.unit || "kobo";  //unit is optional. Default value = "kobo"

    var numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
                    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
                    "nineteen", "twenty", "twenty one", "twenty two", "twenty three", "twenty four", "twenty five",
                    "twenty six", "twenty seven", "twenty eight", "twenty nine", "thirty", "thirty one", "thirty two",
                    "thirty three", "thirty four", "thirty five", "thirty six", "thirty seven", "thirty eight", "thirty nine",
                    "forty", "forty one", "forty two", "forty three", "forty four", "forty five", "forty six", "forty seven",
                    "forty eight", "forty nine", "fifty", "fifty one", "fifty two", "fifty three", "fifty four", "fifty five",
                    "fifty six", "fifty seven", "fifty eight", "fifty nine", "sixty", "sixty one", "sixty two", "sixty three",
                    "sixty four", "sixty five", "sixty six", "sixty seven", "sixty eight", "sixty nine", "seventy", "seventy one",
                    "seventy two", "seventy three", "seventy four", "seventy five", "seventy six", "seventy seven", "seventy eight",
                    "seventy nine", "eighty", "eighty one", "eighty two", "eighty three", "eighty four", "eighty five", "eighty six", "eighty seven",
                    "eighty eight", "eighty nine", "ninety", "ninety one", "ninety two", "ninety three", "ninety four", "ninety five", "ninety six",
                    "ninety seven", "ninety eight", "ninety nine"];

    var placeValue = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion",
                        "nonillion", "decillion", "undecillion", "duodecillion", "tredecillion", "quattuordecillion", "quindecillion",
                        "sexdecillion", "septendecillion", "octodecillion", "novemdecillion", "vigintillion", "unvigintillion",
                        "duovigintillion", "trevigintillion", "quattuorvigintillion", "quinvigintillion", "sexvigintillion", "septenvigintillion",
                        "octovigintillion", "novemvigintillion", "trigintillion", "untrigintillion", "duotrigintillion"];
    
    //Make number a string
    var numberAsString = String(numberToConvert);

    var numberOfDigits = 0;
    var wholeNumPart = "";
    var fractionalPart = "";
    var fractionalWord = "";
    var generatedWord = "";

    //Is there a decimal point? If there is, split the number into two parts
    if (numberAsString.indexOf(".") >= 0)
    {
        wholeNumPart = numberAsString.split(".")[0];
        fractionalPart = numberAsString.split(".")[1];
    }
    else
    {
        wholeNumPart = numberAsString;
    }


    //Work on the whole number part first

    //Get the number of digits
    numberOfDigits = wholeNumPart.length;

    //Pad the most significant figure with zeros if 
    //number of digits is not divisible by 3
    //Padding with the appropriate number of zeros
    //will make the number of digits divisible by 3
    //and hence groupable in threes
    switch (numberOfDigits % 3) {
        case 1:
            wholeNumPart = wholeNumPart.replace(/^/,"00");  //Insert two zeroes at the beginning of the string
            break;
    
        case 2:
            wholeNumPart = wholeNumPart.replace(/^/,"0");   ////Insert a single zero at the beginning of the string
            break;
    }

    //After padding, the number of digits changes
    var newFigureLength = wholeNumPart.length;

    //Get the number of three-digit groups
    var numberOfTrioGroups = newFigureLength / 3;

    var theFirstDigit = 0;
    var theLastTwoDigits = 0;

    if (Number(wholeNumPart) >= 0 && Number(wholeNumPart) <= 99)  //When the user types a number from 0 to 99
    {
        generatedWord = numbers[Number(wholeNumPart)];
    }
    else if (Number(wholeNumPart) >= 100 && Number(wholeNumPart) < 1000)    //When the user types a number from 100 to 999
    {
        //Get the first and last two digits separately
        theFirstDigit =  Number(wholeNumPart.slice(0,1));
        theLastTwoDigits = Number(wholeNumPart.slice(1));

        generatedWord = numbers[theFirstDigit] + " hundred";

        //Append this if the number exceeds the 'Hundred' value
        if (theLastTwoDigits >= 1)
        {
            generatedWord += " and " + numbers[theLastTwoDigits];
        }
    }
    else if (Number(wholeNumPart) >= 1000)  //When the user types any number above and beyond 1000
    {
        var nextStartPosition = 0;

        //Process each trio of digits one after the next
        for (var counter = 1; counter <= numberOfTrioGroups; counter++)
        {
            //Get the first and last two digits separately
            theFirstDigit =  Number(wholeNumPart.slice(nextStartPosition, nextStartPosition + 1));
            theLastTwoDigits = Number(wholeNumPart.slice(nextStartPosition + 1, nextStartPosition + 3));

            if (theFirstDigit >= 1 && theLastTwoDigits >= 1)    //e.g. 617
            {
                generatedWord += numbers[theFirstDigit] + " hundred and " + numbers[theLastTwoDigits];
            }
            else if (theFirstDigit >= 1 && theLastTwoDigits === 0)  //e.g. 300
            {
                generatedWord += numbers[theFirstDigit] + " hundred";
            }
            else if (theFirstDigit >= 0 && theLastTwoDigits >= 1 && !(counter === numberOfTrioGroups))  //e.g. (005)267
            {
                generatedWord += numbers[theLastTwoDigits];
            }
            //This executes only for the last trio of digits
            else if (theFirstDigit >= 0 && theLastTwoDigits >= 1 && counter === numberOfTrioGroups)
            {
                generatedWord += " and " + numbers[theLastTwoDigits];
            }

            //Append the appropriate place values e.g. million, thousand, trillion etc.
            //Skip place values when the current first and last two digits are all zeros
            //Also, put commas and spaces in the right places
            if (!(counter === numberOfTrioGroups || (theFirstDigit === 0 && theLastTwoDigits === 0)))
            {
                generatedWord += " " + placeValue[numberOfTrioGroups - counter] + ", ";
            }

            nextStartPosition +=3;
        }
    }

    //Work on the fractional part
    if (mode === "counting")
    {
        if (fractionalPart.length > 0 && Number(fractionalPart) > 0)
        {
            fractionalWord = " point";

            for (var i = 0; i < fractionalPart.length; i++)
            {
                fractionalWord += " " + numbers[fractionalPart[i]];
            }
        }
    }
    else
    {
        generatedWord += " " + currencyName;

        if (fractionalPart.length === 0)
        {
            //do nothing
        }
        else if (Number(fractionalPart) > 0 && Number(fractionalPart) <= 99)
        {
            fractionalWord += ", and " + numbers[Number(fractionalPart)] + " " + unit;
        }
        else if (Number(fractionalPart) > 99)
        {
            fractionalWord += ", and " + numbers[fractionalPart.slice(0,2)] + " " + unit;
        }
    }

    //Display the whole word now
    return generatedWord + fractionalWord;
};


/*//TEST THE FUNCTION
var converterOptions = {
    // unit: "cents",
    // currencyName: "dollars",
    mode: "financial"
};
var numberToConvert = "489378519005656798.43.43";
var numberInWords = ConvertNumber.toWords(numberToConvert, converterOptions);
console.log(numberToConvert + " = " + numberInWords);

//SAMPLE OUTPUT
//489378519005656798.43 = four hundred and eighty nine quadrillion, three hundred and seventy eight trillion, five hundred and nineteen billion, five million, six hundred and fifty six thousand, seven hundred and ninety eight naira, and forty three kobo
*/