import { createBrowserRouter } from 'react-router-dom';
import config from '../../config';

const router = createBrowserRouter(
  [
    
  ],
  {
    basename:
      process.env.NODE_ENV === 'production' ? config.APP_ROOT : '/',
  }
);

export default router;