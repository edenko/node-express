<h1 align="center">Node.js Rest APIs with Express & MongoDB</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.5.0-blue.svg?cacheSeconds=2592000" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg"/>
</p>

Fast, unopinionated, minimalist web framework for node.
This project with node + express + socket.io + mongodb + atlas + search index
* GitHub : https://github.com/edenko/node-express

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
* ejs
* mongodb (>= 3.0)
* atlas


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
  GET    | /login
  POST   | /login
  GET    | /write
  POST   | /add
  GET    | /list
  DELETE | /delete
  GET    | /detail/id
  GET    | /edit/id
  PATCH  | /edit/id
  GET    | /myPage
  GET    | /search
+--------+-------------------------+
```

## Screens

## Author
👤 **HaYoung Ko**

* Github: [@edenko](https://github.com/edenko)
* email: goodeden3@gmail.com
