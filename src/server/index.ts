import * as express from 'express';
import * as path from 'path';

const window = {};

import serverRenderer from './renderer';

const PORT = 8080;

// initialize the application and create the routes
const app = express();
const router = express.Router();

router.use('^/$', serverRenderer);

// other static resources should just be served as they are
router.use(express.static(
    path.resolve(__dirname, '..', 'static'),
    { maxAge: '30d' },
));

// tell the app to use the above rules
app.use(router);

// start the app
app.listen(PORT, (error) => {
    if (error) {
        return console.log('something bad happened', error);
    }

    console.log("listening on " + PORT + "...");
});

export {};
