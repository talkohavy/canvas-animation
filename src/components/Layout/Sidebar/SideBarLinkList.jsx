import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SideBarLinkItem from './SideBarLinkItem';

const routesRaw = [
  {
    path: '/',
    text: 'Home',
    activeNames: ['/home', '/'],
  },
  {
    path: '/bubbles',
    text: 'Bubbles',
    activeNames: ['/bubbles'],
  },
  {
    path: '/fireworks',
    text: 'Fireworks',
    activeNames: ['/fireworks'],
  },
  {
    path: '/magic-wand',
    text: 'Magic Wand',
    activeNames: ['/magic-wand'],
  },
  {
    path: '/ms-paint',
    text: 'Ms Paint',
    activeNames: ['/ms-paint'],
  },
  {
    path: '/star-shower',
    text: 'Star Shower',
    activeNames: ['/star-shower'],
  },
  {
    path: '/particles',
    text: 'Particles',
    activeNames: ['/particles'],
  },
  {
    path: '/some-url',
    text: 'Not Found Page',
    activeNames: ['/some-url'],
  },
];

export default function SideBarLinkList() {
  const { pathname } = useLocation();

  const routes = useMemo(
    () =>
      routesRaw.map(({ path, text, activeNames }) => ({
        path,
        text,
        isActive: activeNames.some((name) => name === pathname),
      })),
    [pathname],
  );

  return (
    <div className='flex animate-appear flex-col items-start justify-start text-sm font-thin'>
      {routes.map(({ path, text, isActive }) => (
        <SideBarLinkItem key={text} to={path} text={text} isActive={isActive} />
      ))}
    </div>
  );
}
