import React from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Icon,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { apiFetch } from 'lib/api';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const textColor = useColorModeValue('navy.700', 'white');
  const muted = useColorModeValue('secondaryGray.600', 'secondaryGray.300');
  const brandTone = useColorModeValue('brand.500', 'brand.400');

  const [password, setPassword] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const token = params.get('token') || '';

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) {
      toast({ title: 'Missing token', description: 'Request a fresh link.', status: 'error', duration: 4500 });
      return;
    }
    setBusy(true);
    try {
      await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      toast({
        title: 'Password refreshed',
        status: 'success',
        duration: 4000,
      });
      navigate('/auth/sign-in', { replace: true });
    } catch (error) {
      toast({
        title: 'Could not reset',
        description: error?.data?.error || error?.message || 'Ask for a new link.',
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
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        direction="column"
        alignItems="start">
        <Box mb="32px">
          <Heading color={textColor} fontSize="34px" mb="12px">
            Choose new password
          </Heading>
          <Text color={muted}>Strength tip: passphrase with symbols works great.</Text>
        </Box>
        {!token ? (
          <Text color="red.400" mb="22px">
            This link looks incomplete — request another email from Forgot password.

            <NavLink to="/auth/forgot-password">
              <Text as="span" ms="6px" color={brandTone} fontWeight="600">
                Restart flow
              </Text>
            </NavLink>
          </Text>
        ) : null}
        <Flex
          direction="column"
          w={{ base: '100%', md: '420px' }}
          gap="22px"
          as="form"
          onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel color={textColor}>New password</FormLabel>
            <InputGroup>
              <Input
                variant="auth"
                size="lg"
                type={show ? 'text' : 'password'}
                value={password}
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputRightElement mt="10px">
                <Icon
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  cursor="pointer"
                  onClick={() => setShow((s) => !s)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button type="submit" variant="brand" h="54px" isDisabled={!token} isLoading={busy}>
            Update password
          </Button>
          <Text fontSize="sm" color={muted}>
            Return to{' '}
            <NavLink to="/auth/sign-in">
              <Text as="span" color={brandTone} fontWeight="600">
                Sign In
              </Text>
            </NavLink>
          </Text>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}
