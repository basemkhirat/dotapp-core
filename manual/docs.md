# Restfull API Documentation

DotApp provides an easy way to write your API endpoints using swagger tool.

In `app.js` file you can define your docs middleware url

``` javascript
import App from "dotapp";
import { docs, notFound, serverError } from "dotapp/middlewares";

const app = App();

app.use("/api/v1/docs", docs("v1"));

app.use(notFound());
app.use(serverError());

export default app;
```

In the above code, you must specify the version like `v1` which resolve to the `docs/v1` folder in your project.

## Configuration

`docs/v1/index.js` is the configuration file where you can modify and add new API endpoints.

``` javascript
// docs/v1/index.js

import auth from "~/docs/v1/modules/auth";
import media from "~/docs/v1/modules/media";
import user from "~/docs/v1/modules/user";
import role from "~/docs/v1/modules/role";
import permission from "~/docs/v1/modules/permission";

export default {
    swagger: "2.0",
    info: {
        title: "DOTAPP",
        description: "The API documentation",
        version: "1.0.0",
    },
    basePath: "/api/v1",
    paths: {
        ...auth,
        ...media,
        ...user,
        ...role,
        ...permission
    },
    securityDefinitions: {
        "bearer token": {
            type: "apiKey",
            name: "Authorization",
            in: "header",
        },
    },
    responses: {
        "200": {
            description: "Successful operation",
        },
        "401": {
            description: "Unauthenticated",
        },
        "403": {
            description: "Access denied",
        },
        "404": {
            description: "API not found",
        },
        "422": {
            description: "Validation error",
        },
        "429": {
            description: "Rate limit exceeded",
        },
        "500": {
            description: "Internal server error",
        },
    },
};
```
This is the result when browsing `http://localhost:3000/docs`.

![docs](/manual/images/docs.png)


Reference: https://swagger.io/tools/swagger-ui/
