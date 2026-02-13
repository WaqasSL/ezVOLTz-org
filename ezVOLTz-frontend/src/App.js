import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthRoutes from 'routes/useAuthRoutes';

function App() {
  const location = useLocation();
  const routes = useAuthRoutes();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location?.pathname]);

  return <div className='ezAppLayout'>{routes}</div>;
}

export default App;
