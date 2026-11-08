# Student Grade Calculator

**Course:** Platform Technologies | **Program:** BSIT | **Year Level:** 2nd Year

## Description
A simple web application where the user enters grades, calculates the final grade, determines the remarks, and views a grade summary of all students entered.

## Objectives
- Calculate a final grade from weighted scores.
- Determine the equivalent and remarks automatically.
- Validate user input to prevent wrong values.
- Display a searchable, filterable grade summary.

## Features
1. **Home page** with statistics (total, passed, failed, average)
2. **Navigation** between Home, Calculator and Summary
3. **Enter grades** (form: text fields and number inputs)
4. **Calculate** final grade (weighted average) and **determine remarks**
5. **Validate** input (required fields, letters-only name, scores 0-100) with error messages
6. **Display grade summary** table with totals, passed/failed and average
7. **Search** by student or subject, **filter** by remarks
8. **Delete** one record or clear all; **show/hide** computation details
9. Alert messages and data saved with localStorage
10. Responsive layout (desktop, laptop, tablet, mobile)

## Grading
Quizzes 20% + Activities 20% + Project 15% + Midterm 20% + Final Exam 25%. Passing grade: 75%.
Scale: 97+ = 1.00 Excellent, 94 = 1.25 Superior, 91 = 1.50 / 88 = 1.75 Very Good, 85 = 2.00 / 82 = 2.25 Good, 79 = 2.50 / 76 = 2.75 Satisfactory, 75 = 3.00 Passed, below 75 = 5.00 Failed.

## Technologies Used
HTML5, CSS3, JavaScript, Visual Studio Code, Web Browser, Git/GitHub. No backend needed.

## Project Structure
```
GradeCalculator/
├── index.html            Home / main interface
├── pages/
│   ├── calculator.html   Enter grades, final grade, remarks
│   └── summary.html      Grade summary (search, filter, delete)
├── css/style.css
├── js/script.js
├── images/logo.svg
└── README.md
```

## Installation / How to Run
1. Extract the ZIP folder.
2. Open the folder in Visual Studio Code.
3. Double-click `index.html` (or right-click it > Open with Live Server).

## Group Members and Individual Responsibilities
Replace "Member N" with real names. Every member must code and explain their part.

| Member | Responsibility | Technical Contribution |
|---|---|---|
| Member 1 | Project Manager / Lead Developer | Project structure + HTML (`index.html`) |
| Member 2 | UI/UX Designer | Page layout + HTML/CSS |
| Member 3 | Front-End Developer | HTML components (`summary.html`, forms) |
| Member 4 | CSS Developer | Styling + responsive design |
| Member 5 | JavaScript Developer | Feature 1: calculate final grade |
| Member 6 | JavaScript Developer | Feature 2: determine remarks + show/hide computation |
| Member 7 | JavaScript Developer | Feature 3: summary, search, filter, delete, localStorage |
| Member 8 | Data/Form Developer | Forms + validation |
| Member 9 | Testing & Debugging | Testing + bug fixing + code contribution |
| Member 10 | Documentation & Deployment | Code contribution (home stats) + documentation + deployment |

## Git Commit Rule
Each member commits their own work with a clear message, e.g. `Maria - Added responsive CSS`. Avoid `update` or `final`.
