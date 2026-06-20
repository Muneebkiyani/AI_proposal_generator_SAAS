import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdOutlineGroup } from 'react-icons/md';
import StaffUsers from 'views/saas/StaffUsers';

const staffRoutes = [
  {
    name: 'Customers',
    layout: '/staff',
    path: '/users',
    icon: <Icon as={MdOutlineGroup} width="20px" height="20px" color="inherit" />,
    component: <StaffUsers />,
  },
];

export default staffRoutes;
