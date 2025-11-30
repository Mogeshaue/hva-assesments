
let button = document.getElementById("myButton");

// Start the timeout when the user hovers over the button
let timeoutId;
button.addEventListener("mouseenter", function() {
  timeoutId = setTimeout(function() {
    console.log("Tooltip shown");
  }, 3000);
});

// Cancel the timeout if the user moves the mouse away
button.addEventListener("mouseleave", function() {
  clearTimeout(timeoutId); // Tooltip will not show if mouse leaves early
});

// let count = 1;
// let intervalId = setInterval(function() {
//   console.log("Count: " + count);
//   count++;
// }, 1000);

// setTimeout(function() {
//   clearInterval(intervalId);
//   console.log("Stopped counting");
// }, 50000);

// let id=setInterval(function(){
//   console.log('Counting...')
//     console.log(id)
// },1000)

// // console.log(id)
// setInterval(function(){
// clearInterval(id)
// },4000)