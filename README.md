# BinBuddy

BinBuddy is a storage management application designed to help you track and manage items in various bins. It provides a user-friendly interface to add, edit, and delete items, along with the ability to upload images for each item. BinBuddy also supports bulk uploads through an Excel sheet.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Running the Application](#running-the-application)
- [Bulk Upload](#bulk-upload)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- Manage items with names, locations, and photos.
- Upload images for better identification of stored items.
- Bulk upload items via an Excel sheet.
- Bulk export for backup. 

## Prerequisites

Before installing BinBuddy, ensure you have the following installed on your machine:

- **MongoDB** (Community Edition): This will include MongoDB Compass, which allows connection to `localhost`. You can download it from the [MongoDB website](https://www.mongodb.com/try/download/community).
  - **Start MongoDB**: Once installed, you can start the MongoDB server from the command line:
    ```bash
    "C:\Program Files\MongoDB\Server\<your-version>\bin\mongod"
    ```
- **Git**: Download and install from [Git official website](https://git-scm.com/).
- **Node.js** (v14 or later): Download and install from [Node.js official website](https://nodejs.org/).

## Installation

### Step 1: Clone the Repository

Clone the BinBuddy repository from GitHub and navigate to the project directory:


git clone https://github.com/pmcook/BinBuddy.git
cd BinBuddy

Step 2: Install Dependencies

    "exceljs"
    "express" 
    "mongoose"
    "multer"
    "xlsx" 


## Starting

To start the BinBuddy application, follow these steps:

Ensure MongoDB is running by starting mongod:

found at:

"C:\Program Files\MongoDB\Server\<your-version>\bin\mongod"

Run BinBuddy: Start the app with:

Windows-launch

Access BinBuddy: Open a browser and visit the application at http://localhost:3000 or the computer specific IP address, such as http://192.168.1.28:3000.


## Bulk Upload
You can upload multiple items using an Excel sheet:

Template: A template Excel sheet for bulk uploads is available on the website or in the uploads folder.
File Location: Place photos in the uploads folder if specified in the Excel sheet.
Troubleshooting

If you encounter issues:

MongoDB connection error: Ensure MongoDB is running on localhost:27017.
Dependencies: Run npm install again to ensure all dependencies are properly installed.


## Things to add

- export excel back automatically 
- adding diffrent locations
