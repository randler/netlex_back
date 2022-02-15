const express = require('express');
const baseRoutes = require('./routes');
const cors = require('cors');
const userControllerRoutes = require('./controllers/user.controller');
const documentControllerRoutes = require('./controllers/document.controller');
const bodyParser = require('body-parser')
class App {
    constructor() {
        this.server = express();
        this.server.use(express.urlencoded({ extended: false }));
        this.server.use(bodyParser.json());
        this.server.use(cors());
        this.initRoutes();
    }

    initRoutes() {
        this.server.use(baseRoutes);
        this.server.use(userControllerRoutes);
        this.server.use(documentControllerRoutes);
    }
}

module.exports = new App().server;