# backend-assessment-blog-posts
 
## time taken to develop this app

`6 hours 15 minutes`

## docker deployment of app

- `docker-compose up`
    - run this command in the project root directory 

## non-docker deployment method

- `npm install` 
    - run this in the project root directory to install app dependencies

- `npm start`
    - runs the API server 

- `npm run test`
    - run this to run the tests for the server
    - do not run this if server is running already, stop the currently running server (Ctrl+C) and then run this command

- app listens on port `3000`
- actual address it serves to is `0.0.0.0:3000`
    - this is to accommodate docker containerization
    