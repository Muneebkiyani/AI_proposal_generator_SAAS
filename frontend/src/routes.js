import React from 'react';
import SignInCentered from 'views/auth/signIn';
import SignUpCentered from 'views/auth/signUp';
import ForgotPassword from 'views/auth/forgotPassword';
import ResetPassword from 'views/auth/resetPassword';

const routes = [
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: null,
    component: <SignInCentered />,
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    icon: null,
    component: <SignUpCentered />,
  },
  {
    name: 'Forgot Password',
    layout: '/auth',
    path: '/forgot-password',
    icon: null,
    component: <ForgotPassword />,
  },
  {
    name: 'Reset Password',
    layout: '/auth',
    path: '/reset-password',
    icon: null,
    component: <ResetPassword />,
  },
];

export default routes;
