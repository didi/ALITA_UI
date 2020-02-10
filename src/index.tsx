import * as serviceWorker from "./serviceWorker";
import dva from "dva";
import "./index.less";
import "antd/dist/antd.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
// import "@/mocks";
// 1. Initialize
const app = dva();

// 2. Plugins
// app.use(createLoading());

// 3. Model
app.model(require("./models/global.ts").default);
app.model(require("./models/page.ts").default);
app.model(require("./models/dataSource.ts").default);
app.model(require("./models/application.ts").default);
// 4. Router
app.router(require("./App.tsx").default);

// 5. Start
app.start("#root");

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
