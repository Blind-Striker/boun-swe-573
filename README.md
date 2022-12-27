# Vault
This is a project about creating a web application that allows users to save and store content from various web and social media platforms. The app allows users to categorize and easily access the content they have saved.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Building](#building)
5. [Running Tests](#running-tests)
6. [License](#license)

## Features
Save and store content from web and social media platforms
Categorize saved content for easy access
Share and recommend content with other users
Avoid conflicts with duplicate content

## Tech Stack
This project uses a monorepo approach with yarn workspaces and lerna for project management. The server and client are written in TypeScript.

- [TypeScript](https://www.typescriptlang.org/)
- [Nest.js](https://docs.nestjs.com/)
- [MongoDB](https://www.mongodb.com/docs/) (via [mongoose](https://mongoosejs.com/docs/guide.html))
- [Vue.js](https://vuejs.org/guide/introduction.html)
- [Vuex](https://vuex.vuejs.org/)
- [Vuetify](https://next.vuetifyjs.com/en/getting-started/installation/)
- [Docker Compose](https://docs.docker.com/compose/)
- [AWS CDK](https://aws.amazon.com/cdk/)

The server uses Nest.js as the web framework and MongoDB (via mongoose) as the database. Nest.js is a Node.js framework that provides a scalable and maintainable way to develop web applications. MongoDB is a popular NoSQL database that is used for storing unstructured data.

For the client, Vue.js, Vuex, and Vuetify used. Vue.js is a JavaScript framework for building user interfaces. Vuex is a state management library that is designed to work with Vue.js, and Vuetify is a Material Design-based UI framework that provides a consistent look and feel across the application.

Docker Compose is used to run and test the project locally. Docker Compose allows to define and run multiple containers, such as the web server and the database server, in a single, easy-to-use configuration file.

The application is deployed using Github actions and AWS CDK.

## Getting Started
- Clone the repository: git clone https://github.com/[username]/boun-swe-573.git
- Install dependencies: yarn install
- Run the project: docker-compose up

## Building
To build the project, run the following command:

```
yarn build
```
This will build both the server and client projects. The built files will be output to the packages/server/dist and packages/client/dist directories.

## Running Tests
To run the tests for the project, use the following command:

```
yarn test
```
This will run the tests for both the server and client projects.

## License
This project is licensed under the [MIT License](https://github.com/Blind-Striker/boun-swe-573/blob/main/LICENSE).
