import { App } from './app';
import { PORT } from './constants/server';

new App().server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
