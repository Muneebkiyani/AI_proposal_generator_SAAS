import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useAuth } from 'contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function SignUp() {
  const navigate = useNavigate();
  const toast = useToast();
  const { register, loginWithGoogle } = useAuth();
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast({
        title: "Signed up with Google",
        status: "success",
        duration: 2400,
      });
      navigate('/app/proposals', { replace: true });
    } catch (error) {
      toast({
        title: "Google Sign-up failed",
        description: error?.data?.error || error?.message,
        status: "error",
        duration: 4200,
      });
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(email.trim(), password);
      toast({ title: 'Welcome aboard!', status: 'success', duration: 3000 });
      navigate('/app/proposals');
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error?.data?.error || error?.message,
        status: 'error',
        duration: 4500,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column">
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Create account
          </Heading>
          <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
            Register as an end-user to draft proposals instantly.
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
          as="form"
          onSubmit={handleSubmit}>
          <Box mb="26px" w="100%" display="flex" justifyContent="center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast({
                  title: "Google Sign-up failed",
                  status: "error",
                  duration: 4200,
                });
              }}
              width="420px"
              theme={useColorModeValue("outline", "filled_blue")}
            />
          </Box>
          <Flex align="center" mb="25px">
            <Box flex="1" borderBottom="1px solid" borderColor={useColorModeValue('gray.200', 'whiteAlpha.300')} />
            <Text color="gray.400" mx="14px">or</Text>
            <Box flex="1" borderBottom="1px solid" borderColor={useColorModeValue('gray.200', 'whiteAlpha.300')} />
          </Flex>
          <FormControl>
            <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              mb="24px"
              fontWeight="500"
              size="lg"
              autoComplete="email"
            />
            <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                isRequired={true}
                fontSize="sm"
                mb="24px"
                size="lg"
                type={show ? 'text' : 'password'}
                variant="auth"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: 'pointer' }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Button fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" type="submit" isLoading={submitting}>
              Continue
            </Button>
          </FormControl>
          <Flex flexDirection="column" justifyContent="center" alignItems="start" maxW="100%" mt="0px">
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Already registered?
              <NavLink to="/auth/sign-in">
                <Text color={textColorBrand} as="span" ms="5px" fontWeight="500">
                  Sign In
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}
