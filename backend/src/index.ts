import app from './app';
import { env } from './config/env';

const port = env.port;

app.listen(port, () => {
  console.log(`SocialDash backend running on http://localhost:${port}`);
});
