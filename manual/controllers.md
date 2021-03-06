# Controllers

Controllers are classes created in `controllers` directory to handle routes action.

let's create `controllers/HomeController.js`

``` javascript
// controllers/HomeController.js

import Controller from 'dotapp/controller';

export default class extends Controller {
    index(req, res) {
        return res.ok("Hello World!");
    }
}
```

Now, you can link it with application routes.

``` javascript
// routes/index.js

export default {
    "GET /hello": "HomeController.index
}
```

You may want to put your controllers in a sub directories like API versioning. In this case you must specify the controller relative path.

``` javascript
// routes/index.js

export default {
    "POST /api/v1/user": "v1/UsersController.create
}
```
