import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { apiFetch } from 'lib/api';

export default function ForgotPassword() {
  const toast = useToast();
  const textColor = useColorModeValue('navy.700', 'white');
  const muted = useColorModeValue('secondaryGray.600', 'secondaryGray.300');
  const brandTone = useColorModeValue('brand.500', 'brand.400');
  const [email, setEmail] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      toast({
        title: 'Check your inbox',
        description: 'If your account exists we just sent reset instructions.',
        status: 'success',
        duration: 6000,
      });
      setEmail('');
    } catch (error) {
      toast({
        title: 'Request failed',
        description: error?.message || 'Please try again in a minute.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        mt={{ base: '40px', md: '14vh' }}
        px={{ base: '25px', md: '0px' }}
        direction="column"
        alignItems="start">
        <Box me="auto" mb="32px">
          <Heading color={textColor} fontSize="34px" mb="16px">
            Reset password
          </Heading>
          <Text color={muted}>We will send a signed link valid for one hour.</Text>
        </Box>
        <Flex
          direction="column"
          w={{ base: '100%', md: '420px' }}
          as="form"
          gap="22px"
          onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel color={textColor}>Email address</FormLabel>
            <Input
              variant="auth"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              size="lg"
            />
          </FormControl>
          <Button type="submit" variant="brand" h="54px" isLoading={busy}>
            Send recovery email
          </Button>
          <Text fontSize="sm" color={muted}>
            Already remember it?{' '}
            <NavLink to="/auth/sign-in">
              <Text as="span" color={brandTone} fontWeight="600">
                Back to Sign In
              </Text>
            </NavLink>
          </Text>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}
