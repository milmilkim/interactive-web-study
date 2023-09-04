import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter(
  [
    
  ],
  {
    basename:
      process.env.NODE_ENV === 'production' ? '/interactive-web-study/07-리액트/dist/' : '/',
  }
);

export default router;