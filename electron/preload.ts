import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  app: {
    name: "Church AI Worship Presentation",
    version: "0.1.0",
  },
});
