$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDLn7iZkNqWPmb8lY1T4zneUmwdKyFoXdg",
    authDomain: "class-activities-3b901.firebaseapp.com",
    databaseURL: "https://class-activities-3b901.firebaseio.com",
    projectId: "class-activities-3b901",
    storageBucket: "class-activities-3b901.appspot.com",
    messagingSenderId: "1019270908658"
  };
  firebase.initializeApp(config);

  var database = firebase.database();



  $("#train-form").on("submit", function (event) {
    event.preventDefault();

    var trainDataInput = {
      name: $("#name-input").val().trim(),
      destination: $("#destination-input").val().trim(),
      arrivalTime: $("#arrival-input").val().trim(),
      frequency: $("#frequency").val().trim()
    }

    // add to firebase

    database.ref().push(trainDataInput)
  })

  database.ref().on("child_added", function (childSnapshot) {

    var minAway;

    var firstTrainNew = moment(childSnapshot.val().arrivalTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % childSnapshot.val().frequency;
    var minAway = childSnapshot.val().frequency - remainder;
    var nextTrain = moment().add(minAway, "minutes");
    nextTrain = moment(nextTrain).format("HH:mm");


    var trainData = childSnapshot.val();
    var tableRow = $("<tr class='text-center'>");

    var tdName = $("<td>").text(trainData.name)
    var tdDestination = $("<td>").text(trainData.destination)

    var tdArrival = $("<td>").text(nextTrain)
    var tdFrequency = $("<td>").text(`${trainData.frequency} minutes`);



    tableRow.append(tdName, tdDestination, tdArrival, tdFrequency);

    $("tbody").append(tableRow);

  }, function (errObject) {
    console.log("Errors: " + errObject.code);
  });
});