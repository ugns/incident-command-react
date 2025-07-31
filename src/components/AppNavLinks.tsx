import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import type { RouteConfigNav, RouteConfigSeparator } from '../routesConfig';
import type { FeatureFlags } from '../types/FeatureFlags';

// Type guards
function isSeparator(link: RouteConfigNav | RouteConfigSeparator): link is RouteConfigSeparator {
  return 'separator' in link && link.separator === true;
}
function isNav(link: RouteConfigNav | RouteConfigSeparator): link is RouteConfigNav {
  return !isSeparator(link);
}

interface AppNavLinksProps {
  links: (RouteConfigNav | RouteConfigSeparator)[];
  navType: 'main' | 'admin';
  featureFlags?: FeatureFlags;
  onNav: () => void;
}

const AppNavLinks: React.FC<AppNavLinksProps> = ({ links, navType, featureFlags = {}, onNav }) => {
  const navigate = useNavigate();
  return (
    <Nav className={navType === 'admin' ? 'flex-column' : 'me-auto'}>
      {links
        .filter(link =>
          navType === 'admin'
            ? isSeparator(link) || (isNav(link) && link.admin)
            : isNav(link) && link.nav
        )
        .filter(link => {
          if (isSeparator(link)) return true;
          if (isNav(link) && link.show && typeof link.show === 'string') {
            // Type-safe check: only allow keys that exist in FeatureFlags
            return (featureFlags as any)[link.show] === true;
          }
          return true;
        })
        .map((link, idx) =>
          isSeparator(link) ? (
            <React.Fragment key={`sep-${idx}`}>
              {link.group && <div className="text-muted small px-2 pb-1 mt-3">{link.group}</div>}
              <hr className="my-2 mb-3" />
            </React.Fragment>
          ) : navType === 'main' ? (
            <Nav.Link
              key={link.key}
              as={Link}
              to={link.path ?? `/${link.key}`}
              disabled={link.disabled}
              onClick={onNav}
            >
              {link.label}
            </Nav.Link>
          ) : (
            <Nav.Link
              key={link.key}
              onClick={() => {
                if (onNav) onNav();
                navigate(link.path ?? `/${link.key}`);
              }}
            >
              {link.label}
            </Nav.Link>
          )
        )}
    </Nav>
  );
};

export default AppNavLinks;
