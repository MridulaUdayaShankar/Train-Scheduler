/* global firebase moment */

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAJ0yvxjdtkyzyBR3EZONRP2LrwvFpWowg",
    authDomain: "train-scheduler-19467.firebaseapp.com",
    databaseURL: "https://train-scheduler-19467.firebaseio.com",
    projectId: "train-scheduler-19467",
    storageBucket: "train-scheduler-19467.appspot.com",
    messagingSenderId: "142963230637"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var trainDestination = $("#destination-input")
    .val()
    .trim();
  var firstTrainTime = moment(
    $("#first-train-time-input")
      .val()
      .trim(),
    "HH:mm"
  ).format();
  var trainFrequency = $("#frequency-input")
    .val()
    .trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    trainTime: firstTrainTime,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.trainTime);
  console.log(newTrain.frequency);

  // Alert
  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().trainTime;
  var trainFrequency = childSnapshot.val().frequency;

  // train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(firstTrainTime);
  console.log(trainFrequency);

  // Prettify the train start
  var trainTimePretty = moment.unix(firstTrainTime).format("HH:mm");
  console.log(trainTimePretty);

  // Assumptions
  var tFrequency = 5;

  // Time is 3:30 AM
  var firstTime = "06:00";

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  //Add each train's data into the table
  $("#train-table > tbody").append(
    "<tr><td>" +
      trainName +
      "</td><td>" +
      trainDestination +
      "</td><td>" +
      tFrequency +
      "</td><td>" +
      nextTrain +
      "</td><td>" +
      tMinutesTillTrain +
      "</td></tr>"
  );
});
