import { App } from './app';
import { PORT } from './constants/server';
// eslint-disable-next-line no-console
new App().server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
