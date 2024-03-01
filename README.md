# MY BRAND REST API built with Express NodeJs Typescript and MongoDB

### A fully functional REST API written in NodeJs Express and Typescript

## Introduction

* This is a simple node express API that is mainly built to handle user authentication and authorization, creating, updating, commenting and  liking blogs along side creating and storing messages from users to admin
* The admin has a priviledge to access 100% of all routes as the other users have acces to a limited number of routes

## Requirements

[NodeJS](https://nodejs.org/en/)

Install global TypeScript and TypeScript Node

```
npm install -g typescript ts-node-dev
```

## Getting Started

You should install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) on your local machine, or use other services such as [mLab](https://mlab.com/) or [Compose](https://www.compose.com/compare/mongodb)

After that, you will have to replace the mongoURL with your MongoDB address in *src/index.ts*
 
## Clone this repository

```
https://github.com/kanu-cast/mybrand-api.git .
```

Then install the dependencies

```
npm install
```

## Start the server

Run in development mode

```
npm start
```

## Automated Testing with jest (locally)

```
npm run test
```
