import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/index';

const HomePage = lazy(() => import('./pages/Home'));
const BubblesPage = lazy(() => import('./pages/Bubbles'));
const FireworksPage = lazy(() => import('./pages/Fireworks'));
const MagicWand = lazy(() => import('./pages/MagicWand'));
const MsPaint = lazy(() => import('./pages/MsPaint'));
const StarShower = lazy(() => import('./pages/StarShower'));
const Particles = lazy(() => import('./pages/Particles'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));

function App() {
  return (
    <Layout>
      <Suspense>
        <Routes>
          <Route path='/index.html' element={<HomePage />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/bubbles' element={<BubblesPage />} />
          <Route path='/fireworks' element={<FireworksPage />} />
          <Route path='/magic-wand' element={<MagicWand />} />
          <Route path='/ms-paint' element={<MsPaint />} />
          <Route path='/star-shower' element={<StarShower />} />
          <Route path='/particles' element={<Particles />} />

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
