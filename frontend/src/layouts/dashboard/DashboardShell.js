// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function DashboardShell({
  routes,
  layoutPrefix,
  logoText = 'Proposal AI',
  ...rest
}) {
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const getRoute = () => {
    return window.location.pathname !== `${layoutPrefix}/full-screen-maps`;
  };
  const getActiveRoute = (routeList) => {
    let activeRoute = 'Dashboard';
    for (let i = 0; i < routeList.length; i++) {
      if (routeList[i].collapse) {
        const collapseActiveRoute = getActiveRoute(routeList[i].items);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routeList[i].category) {
        const categoryActiveRoute = getActiveRoute(routeList[i].items);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else if (
        window.location.href.indexOf(routeList[i].layout + routeList[i].path) !== -1
      ) {
        return routeList[i].name;
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routeList) => {
    let activeNavbar = false;
    for (let i = 0; i < routeList.length; i++) {
      if (routeList[i].collapse) {
        const collapseActiveNavbar = getActiveNavbar(routeList[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routeList[i].category) {
        const categoryActiveNavbar = getActiveNavbar(routeList[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else if (
        window.location.href.indexOf(routeList[i].layout + routeList[i].path) !== -1
      ) {
        return routeList[i].secondary;
      }
    }
    return activeNavbar;
  };
  const getActiveNavbarText = (routeList) => {
    let activeNavbar = false;
    for (let i = 0; i < routeList.length; i++) {
      if (routeList[i].collapse) {
        const collapseActiveNavbar = getActiveNavbarText(routeList[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routeList[i].category) {
        const categoryActiveNavbar = getActiveNavbarText(routeList[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else if (
        window.location.href.indexOf(routeList[i].layout + routeList[i].path) !== -1
      ) {
        return routeList[i].messageNavbar;
      }
    }
    return activeNavbar;
  };

  document.documentElement.dir = 'ltr';
  const { onOpen } = useDisclosure();
  document.documentElement.dir = 'ltr';
  return (
    <Box>
      <Box>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          <Sidebar routes={routes} display="none" {...rest} />
          <Box
            float="right"
            minHeight="100vh"
            height="100%"
            overflow="auto"
            position="relative"
            maxHeight="100%"
            w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
            transitionDuration=".2s, .2s, .35s"
            transitionProperty="top, bottom, width"
            transitionTimingFunction="linear, linear, ease"
          >
            <Portal>
              <Box>
                <Navbar
                  onOpen={onOpen}
                  logoText={logoText}
                  brandText={getActiveRoute(routes)}
                  secondary={getActiveNavbar(routes)}
                  message={getActiveNavbarText(routes)}
                  fixed={fixed}
                  sidebarRoutes={routes}
                  {...rest}
                />
              </Box>
            </Portal>

            {getRoute() ? (
              <Box
                mx="auto"
                p={{ base: '20px', md: '30px' }}
                pe="20px"
                minH="100vh"
                pt="50px"
              >
                <Outlet />
              </Box>
            ) : null}
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}
