import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdLock, MdOutlineGroup } from 'react-icons/md';
import SuperAdmins from 'views/saas/SuperAdmins';
import SuperUsers from 'views/saas/SuperUsers';

const superRoutes = [
  {
    name: 'Admins',
    layout: '/super',
    path: '/admins',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SuperAdmins />,
  },
  {
    name: 'Customers',
    layout: '/super',
    path: '/users',
    icon: <Icon as={MdOutlineGroup} width="20px" height="20px" color="inherit" />,
    component: <SuperUsers />,
  },
];

export default superRoutes;
