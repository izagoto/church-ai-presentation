"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("api", {
    app: {
        name: "Church AI Worship Presentation",
        version: "0.1.0",
    },
});
