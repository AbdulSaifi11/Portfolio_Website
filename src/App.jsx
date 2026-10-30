import { lazy, Suspense } from 'react';
import { RouterProvider, useRouter } from './routing/Router.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Skills = lazy(() => import('./pages/Skills.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const AdminMessages = lazy(() => import('./pages/AdminMessages.jsx'));

function PageLoading() {
  return <main className="page-loading" role="status" aria-label="Loading page"><span /><span /><span /><span className="visually-hidden">Loading page</span></main>;
}

const routes = [
  { paths: ['/', '/index.html'], Page: Home },
  { paths: ['/about', '/aboutme.html'], Page: About },
  { paths: ['/skills', '/skills.html'], Page: Skills },
  { paths: ['/contact', '/contact.html'], Page: Contact },
  { paths: ['/admin/messages'], Page: AdminMessages },
];

function RoutedApp() {
  const { path } = useRouter();
  const match = routes.find((route) => route.paths.includes(path));
  const Page = match?.Page ?? Home;

  return (
    <>
      <SiteHeader />
      <Suspense fallback={<PageLoading />}><Page /></Suspense>
      <SiteFooter />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <RoutedApp />
    </RouterProvider>
  );
}
