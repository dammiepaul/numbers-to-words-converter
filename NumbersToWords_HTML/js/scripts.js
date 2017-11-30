var converterOptions = {
    mode: "financial"
};

$("#numberToConvert").on('keyup', function(event) {
    var numberToConvert = $("#numberToConvert").val();

    var convertedText = ConvertNumber.toWords(numberToConvert, converterOptions);
    $(".well").text(convertedText)
});