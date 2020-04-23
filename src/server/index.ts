import * as express from 'express';

import * as path from 'path';

import { clientAssets } from './middleware/clientAssets';
import { prepareState } from './middleware/prepareState';
import { renderPage } from './middleware/renderPage';
import { errorHandler } from './middleware/errorHandler';
import { routeApi } from './middleware/routeApi';

const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.use(routeApi());
app.use(prepareState());
app.use(clientAssets());
app.use(renderPage());
app.use(errorHandler());

app.listen(process.env.PORT || 3000);
