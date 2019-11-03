let model;
(async function () {
    const var1 = await fetch("CatModel/tensorflowjsCatClassifier/model.json");
    console.log(var1);
    model = await tf.loadModel("CatModel/tensorflowjsCatClassifier/model.json");
    $(".progress-bar").hide();
})();

$("#image-selector").change(function () {
    console.log("Starting file reader");

    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image-selector").prop("files")[0];
    reader.readAsDataURL(file);

    console.log("Read file");
});

$('#predict-button').click(async function () {
    console.log("predicting");
    let image = $("#selected-image").get(0);
    console.log(image);

    var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        img = new Image(),
        w = canvas.width / 3;

    ctx.drawImage(image, 0, 0);
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    console.log("Image data");
    console.log(data.length);
    console.log(canvas.width);
    console.log(canvas.height);
    console.log(data);

    for (var i = 0; i < data.length; i += 4) {
        data[i] = data[i] / 255.0;   // Red
        data[i + 1] = data[i + 1] / 255.0; // Green
        data[i + 2] = data[i + 2] / 255.0; // Blue
    }

    let tensor = tf.fromPixels(imgData)
        .resizeNearestNeighbor([250, 250])
        .toFloat()
        .expandDims();

    console.log(tensor.shape);
    console.log(tensor[0, 0, 0]);

    console.log("getting predictions from model");
    let predictions = await model.predict(tensor).data();
    let top5 = Array.from(predictions)
        .map(function (p, i) {
            return {
                probability: p,
                className: IMAGENET_CLASSES[i]
            };
        }).sort(function (a, b) {
            return b.probability - a.probability;
        }).slice(0, 5);

    console.log("making prediction list");
    $("#prediction-list").empty();
    top5.forEach(function (p) {
        $("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
});