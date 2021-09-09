# Calories App

Calories App is a simple tool that enables users to track their food consumption and restrict their calorie intake. 

## Features

- Track Food Entries with daily limit exceeded highlighting.
- Food Suggestions powered by Nutritionix which gives calorie value for a wide array of foods.
- Admin management and reports to track usage of the App.
- A widget to invite your friends. 


## Tech

Technologies required to run Calories App are : 

- React JS
- Node JS
- PostgreSQL

## Installation

This repository contains 2 folders - portal (React JS UI) and server (Express JS Server). Follow these steps to run Calories App : 

React JS UI
```sh
Clone this repository
cd portal 
npm install
npm start
```
Express JS Server
```sh
Clone this repository
Setup a PostgreSQL instance and provide DB details in server/.env 
Execute server/db_scripts.sql in DB
cd server
npm install
npm run devStart
```

API testing 

```sh
cd server
npm test
```

## API Details 

| Endpoint | Description |
| ------ | ------ |
| GET /foodentry | API to fetch all Food Entries |
| GET /foodentry/:id | API to fetch Food Entry based on ID |
| POST /foodentry | API to create Food Entry |
| PUT /foodentry/:id | API to update Food Entry |
| DELETE /foodentry/:id | API to delete Food Entry |
| GET /foodentry/adminreports | API to fetch all Admin reports |
| GET /foodentry/daily_limit_exceeded_report | API to fetch daily limit exceeded report |


## Sample Request Body for POST/PUT : 
{
    "datetime": "2021-09-07T11:25:23.711Z",
    "food": "Hamburger",
    "calories": 250,
    "user_id": 12
}

## Sample Response Body for GET : 
{
    "data": [
        {
            "id": 64,
            "datetime": "2021-09-08T00:28:09.935Z",
            "food": "Hamburger Bun",
            "calories": 120,
            "user_id": 22,
            "email": "testuser001@example.com",
            "total_calories": 120,
            "daily_limit": 2100
        }
    ]
}
