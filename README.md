# Node.js Rest APIs with Express & MongoDB

## Project setup
```
npm install
```

### Run
```
nodemon server.js
```
Load `http://localhost:8080` to test the endpoint. It will display a result `listening on 8080`

## Requirements
* node (>= 10.5.0)
* express
* passport
* express-session
* mongodb (>= 3.0)
* ejs

## App Structure
> _Note: I am mentioning only files/folders which you need to configure if required_
 ```bash
node-express/
├── package-lock.json
├── package.json
├── server.js
└── views
    ├── detail.ejs
    ├── edit.ejs
    ├── index.ejs
    ├── list.ejs
    ├── login.ejs
    ├── myPage.ejs
    ├── nav.html
    └── write.ejs
 ```

## List of API Endpoints

```sh
+--------+-------------------------+
  Method | URI
+--------+-------------------------+
  GET    | /
  GET    | /signup
  POST   | /signup
  GET    | /login
  POST   | /login
  GET    | /logout
  GET    | /account
  GET    | /auth/google
  GET    | /auth/google/callback
  GET    | /auth/twitter
  GET    | /auth/twitter/callback
  GET    | /status-monitor
+--------+-------------------------+
```

## Screens