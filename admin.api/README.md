# Server setup

## Requirements
- **Node**: At least 8.9.4 version
- **MongoDB**: 3.0.15 version

## Starting the server
  1. First, you have to start the MongoDB server, with the following command from the command line:

     `"Location-of-mongod.exe" --dbpath "...path...\admin.db"`
     
     (example: `"C:\Program Files\MongoDB\Server\3.0\bin\mongod.exe" --dbpath "C:\Desktop\projekt-eszkozok-admin\admin.db"`)
     
  2. After the database is running, open an other command line, navigate to the `\admin.api` folder, and execute the following command, to start the server: `node app.js`

## Running the tests
To run the tests, first you have to navigate to the `\admin.api` folder in the command line, than you have to execute the `npm test` command.