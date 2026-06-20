import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdHome, MdPerson } from 'react-icons/md';
import Profile from 'views/admin/profile';
import UserProposal from 'views/saas/UserProposal';

const userRoutes = [
  {
    name: 'Proposal Studio',
    layout: '/app',
    path: '/proposals',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <UserProposal />,
  },
  {
    name: 'Profile',
    layout: '/app',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
];

export default userRoutes;
