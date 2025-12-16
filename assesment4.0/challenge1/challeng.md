Your Task
Create the questions data
Hardcode an array of 6 question objects.
Each question must be an object with the following properties:
questionText (string)
correctAnswer (string)
incorrectAnswers (array of exactly 3 strings)
Display the question on the page
On page load, display the first question.
The following must be visible on the page:

The question number (example: Question 1)


The question text

4 options displayed as radio buttons
Place all 4 radio buttons in the HTML upfront.

Use JavaScript to update the radio button labels and values for every question.


A Next button


A question status area, which is initially empty and later displays Correct or Wrong

Handle user interaction
Use addEventListener for all interactions (do not use onclick in HTML).
When the user selects an option:
Check whether the selected option matches the current question’s correctAnswer.
Display Correct or Wrong in the question status area.
When the user clicks the Next button:
Display the next question from the array.
Update the question number, question text, and radio button labels/values.
Make sure no radio option is selected for the new question.
Make sure the question status area is empty for the new question.
After the 6th question:
When the user clicks Next, display the message “All questions are over.”
No further interaction is required after this point.
Note
You may search online to understand:

How radio buttons work in HTML
How to detect which radio button is selected
How to remove an existing selection from radio buttons using JavaScript
Sample Data
javascript


