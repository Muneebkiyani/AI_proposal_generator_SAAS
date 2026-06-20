import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  SimpleGrid,
  VStack,
  Image,
  Avatar,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { NavLink, Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { MdCheckCircle, MdSpeed, MdAutoAwesome, MdWorkOutline, MdStar } from 'react-icons/md';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

export default function LandingPage() {
  const { user } = useAuth();
  
  // Theme Colors
  const bg = useColorModeValue('white', 'navy.900');
  const textColor = useColorModeValue('navy.700', 'white');
  const textMuted = useColorModeValue('gray.500', 'gray.400');
  const sectionBg = useColorModeValue('gray.50', 'navy.800');
  const cardBg = useColorModeValue('white', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Gradient for Hero
  const heroBgGradient = useColorModeValue(
    'linear(to-br, brand.50, white, brand.50)', 
    'linear(to-br, navy.900, brand.900, navy.900)'
  );
  
  const navBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(11, 20, 55, 0.8)');
  const imageBorder = useColorModeValue('white', 'navy.800');

  if (user) {
    return <Navigate to="/app/proposals" replace />;
  }

  return (
    <Box bg={bg} minH="100vh" overflowX="hidden">
      {/* Navbar */}
      <Box position="fixed" w="100%" zIndex={999} bg={navBg} backdropFilter="blur(10px)" borderBottom="1px solid" borderColor={borderColor}>
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1rem 1.5rem" maxW="1200px" mx="auto">
          <Flex align="center" mr={5}>
            <Icon as={MdAutoAwesome} color="brand.500" w={8} h={8} mr={2} />
            <Heading as="h1" size="md" letterSpacing={'tighter'} color={textColor} fontWeight="800">
              ProposalGen
            </Heading>
          </Flex>
          <Stack direction="row" spacing={4} align="center">
            <NavLink to="/auth/sign-in">
              <Button variant="ghost" color={textColor} size="sm" fontWeight="600">
                Sign In
              </Button>
            </NavLink>
            <NavLink to="/auth/sign-up">
              <Button colorScheme="brand" variant="solid" rounded="full" size="sm" px={6} shadow="md">
                Get Started
              </Button>
            </NavLink>
          </Stack>
        </Flex>
      </Box>

      {/* Hero Section */}
      <Box 
        position="relative"
        pt={{ base: 32, md: 40 }} 
        pb={{ base: 20, md: 32 }}
        backgroundImage="url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment="fixed"
      >
        <Box position="absolute" top={0} left={0} w="100%" h="100%" bg="navy.900" opacity={0.85} zIndex={0} />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} alignItems="center">
            <MotionStack 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              spacing={{ base: 8, md: 10 }}
            >
              <Box>
                <Text color="brand.400" fontWeight="700" letterSpacing="widest" textTransform="uppercase" mb={3}>
                  The #1 AI Tool for Freelancers
                </Text>
                <Heading fontWeight={800} fontSize={{ base: '4xl', sm: '5xl', md: '6xl' }} lineHeight="1.1" color="white">
                  Win more clients with <br />
                  <Text as="span" bgGradient="linear(to-r, brand.400, purple.300)" bgClip="text">
                    AI-crafted proposals
                  </Text>
                </Heading>
              </Box>
              <Text color="gray.300" fontSize={{ base: 'lg', sm: 'xl' }} maxW="lg" lineHeight="1.6">
                Stop staring at a blank screen. Generate highly-converting, personalized freelance proposals in seconds based on your specific skills and the client's exact job description.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <NavLink to="/auth/sign-up">
                  <Button rounded="full" size="lg" colorScheme="brand" px={10} h="60px" fontSize="lg" shadow="xl" _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }}>
                    Start generating for free
                  </Button>
                </NavLink>
              </Stack>
              <Flex align="center" gap={3} pt={4}>
                <Flex>
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Icon key={i} as={MdStar} color="yellow.400" w={5} h={5} />
                  ))}
                </Flex>
                <Text color="gray.400" fontSize="sm" fontWeight="500">Loved by 10,000+ Upwork & Fiverr top-rated freelancers.</Text>
              </Flex>
            </MotionStack>
            
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              position="relative"
            >
              {/* Decorative background blob */}
              <Box position="absolute" top="-10%" left="-10%" w="120%" h="120%" bg="brand.500" filter="blur(100px)" opacity="0.1" rounded="full" zIndex={0} />
              <Image 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Freelancer at laptop" 
                rounded="3xl"
                shadow="2xl"
                objectFit="cover"
                position="relative"
                zIndex={1}
                border="8px solid"
                borderColor={imageBorder}
              />
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Social Proof Logos */}
      <Box bg={sectionBg} py={10} borderTop="1px solid" borderBottom="1px solid" borderColor={borderColor}>
        <Container maxW="container.xl">
          <Text textAlign="center" color={textMuted} fontWeight="600" mb={6} textTransform="uppercase" letterSpacing="wider" fontSize="sm">
            Used by freelancers on top platforms
          </Text>
          <Flex justify="center" align="center" wrap="wrap" gap={{ base: 10, md: 20 }} opacity={0.5} grayscale={1}>
            <Heading size="md" color={textColor}>Upwork</Heading>
            <Heading size="md" color={textColor}>Fiverr</Heading>
            <Heading size="md" color={textColor}>Toptal</Heading>
            <Heading size="md" color={textColor}>Freelancer.com</Heading>
            <Heading size="md" color={textColor}>Guru</Heading>
          </Flex>
        </Container>
      </Box>

      {/* How it Works Section */}
      <Box py={24}>
        <Container maxW="container.xl">
          <VStack spacing={3} textAlign="center" mb={20}>
            <Text color="brand.500" fontWeight="700" textTransform="uppercase" letterSpacing="widest">Simple Workflow</Text>
            <Heading as="h2" fontSize={{ base: '3xl', md: '5xl' }} color={textColor} fontWeight="800">
              3 steps to your next client
            </Heading>
            <Text fontSize="xl" color={textMuted} maxW="2xl">
              From reading the job post to hitting send, our AI handles the heavy lifting so you can focus on the interview.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {[
              {
                title: "1. Paste the Job",
                desc: "Simply copy and paste the job description from any job board directly into the app.",
                icon: MdWorkOutline,
                image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "2. Add your Skills",
                desc: "Tell the AI your relevant strengths, portfolio links, and why you are a great fit.",
                icon: MdAutoAwesome,
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "3. Generate & Win",
                desc: "In under 3 seconds, get a perfectly formatted, highly persuasive proposal ready to send.",
                icon: MdSpeed,
                image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
            ].map((step, index) => (
              <MotionBox 
                key={index}
                bg={cardBg} 
                rounded="3xl" 
                shadow="xl"
                overflow="hidden"
                border="1px solid"
                borderColor={borderColor}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Image src={step.image} h="200px" w="100%" objectFit="cover" />
                <Box p={8}>
                  <Flex w={12} h={12} align="center" justify="center" bg="brand.100" color="brand.500" rounded="xl" mb={6}>
                    <Icon as={step.icon} w={6} h={6} />
                  </Flex>
                  <Heading size="lg" mb={4} color={textColor} fontWeight="700">{step.title}</Heading>
                  <Text color={textMuted} fontSize="md" lineHeight="tall">{step.desc}</Text>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Feature Highlight */}
      <Box bg={sectionBg} py={24}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={20} alignItems="center">
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Team Collaboration" 
                rounded="3xl"
                shadow="2xl"
              />
            </MotionBox>
            <Stack spacing={8}>
              <Text color="brand.500" fontWeight="700" textTransform="uppercase" letterSpacing="widest">Unfair Advantage</Text>
              <Heading size="2xl" color={textColor} fontWeight="800" lineHeight="1.2">
                Stop wasting hours on writing.
              </Heading>
              <Text color={textMuted} fontSize="xl" lineHeight="1.8">
                Freelancers spend an average of 45 minutes crafting a single proposal. With our AI, you can condense that into 30 seconds. We've trained our models to focus on client pain points, removing fluff and getting straight to why you are the best hire.
              </Text>
              <Stack spacing={5} mt={4}>
                {[
                  "Trained on 10,000+ winning freelance proposals",
                  "Bypasses AI-detectors with natural, human language",
                  "Instantly adapts tone to match the client's job post",
                  "100% secure. We never train on your private data."
                ].map((feature, i) => (
                  <Flex key={i} align="center">
                    <Flex justify="center" align="center" w={8} h={8} rounded="full" bg="brand.100" color="brand.500" mr={4} shrink={0}>
                      <Icon as={MdCheckCircle} w={5} h={5} />
                    </Flex>
                    <Text color={textColor} fontSize="lg" fontWeight="600">{feature}</Text>
                  </Flex>
                ))}
              </Stack>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxW="container.xl" py={24}>
        <VStack spacing={3} textAlign="center" mb={16}>
          <Heading as="h2" fontSize="4xl" color={textColor} fontWeight="800">
            Don't just take our word for it
          </Heading>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {[
            {
              quote: "This tool completely changed my Upwork game. I used to apply to 5 jobs a day, now I apply to 20 with higher quality proposals. My interview rate doubled in a week.",
              name: "Sarah Jenkins",
              title: "Senior UX Designer",
              img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
            },
            {
              quote: "I hate writing about myself. ProposalGen takes my messy bullet points about my skills and turns them into a masterpiece. Worth every single penny of the Pro plan.",
              name: "David Chen",
              title: "Full Stack Developer",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
            },
            {
              quote: "The proposals don't sound like robots. That's the best part. Clients constantly compliment my 'attention to detail' in my cover letters now. Highly recommend.",
              name: "Elena Rodriguez",
              title: "Digital Marketer",
              img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
            }
          ].map((test, i) => (
            <Box key={i} bg={cardBg} p={8} rounded="2xl" shadow="lg" border="1px solid" borderColor={borderColor}>
              <Flex gap={1} mb={4}>
                {[1, 2, 3, 4, 5].map((_, j) => <Icon key={j} as={MdStar} color="yellow.400" />)}
              </Flex>
              <Text color={textColor} fontSize="lg" mb={8} fontStyle="italic">"{test.quote}"</Text>
              <Flex align="center">
                <Avatar src={test.img} mr={4} size="md" />
                <Box>
                  <Text fontWeight="700" color={textColor}>{test.name}</Text>
                  <Text fontSize="sm" color={textMuted}>{test.title}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* Pricing / Plans */}
      <Box bg={sectionBg} py={24} id="pricing">
        <Container maxW="container.xl">
          <VStack spacing={4} textAlign="center" mb={16}>
            <Text color="brand.500" fontWeight="700" textTransform="uppercase" letterSpacing="widest">Pricing</Text>
            <Heading as="h2" fontSize="5xl" color={textColor} fontWeight="800">
              Simple, transparent pricing
            </Heading>
            <Text fontSize="xl" color={textMuted}>
              Make your money back with your very first client win.
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} maxW="4xl" mx="auto">
            {/* Free Plan */}
            <MotionBox 
              bg={cardBg} 
              rounded="3xl" 
              shadow="md" 
              p={12} 
              border="1px solid" 
              borderColor={borderColor}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Text fontSize="2xl" fontWeight="700" color={textColor}>Starter</Text>
              <Text fontSize="6xl" fontWeight="900" my={4} color={textColor}>$0 <Text as="span" fontSize="xl" color={textMuted} fontWeight="500">/mo</Text></Text>
              <Text color={textMuted} mb={8} fontSize="lg">Perfect to test the waters.</Text>
              <Stack spacing={5} mb={10}>
                <Flex align="center">
                  <Icon as={MdCheckCircle} color="brand.500" w={6} h={6} mr={3} />
                  <Text color={textColor} fontWeight="500" fontSize="lg">5 proposals per month</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={MdCheckCircle} color="brand.500" w={6} h={6} mr={3} />
                  <Text color={textColor} fontWeight="500" fontSize="lg">Standard AI models</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={MdCheckCircle} color="brand.500" w={6} h={6} mr={3} />
                  <Text color={textColor} fontWeight="500" fontSize="lg">Community support</Text>
                </Flex>
              </Stack>
              <NavLink to="/auth/sign-up">
                <Button w="full" size="lg" h="60px" variant="outline" colorScheme="brand" rounded="full" fontSize="lg" fontWeight="700">
                  Get Started Free
                </Button>
              </NavLink>
            </MotionBox>
            
            {/* Pro Plan */}
            <MotionBox 
              bg={cardBg} 
              rounded="3xl" 
              shadow="2xl" 
              p={12} 
              border="3px solid" 
              borderColor="brand.500" 
              position="relative"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Box position="absolute" top="-16px" left="50%" transform="translateX(-50%)" bg="brand.500" color="white" px={6} py={1.5} rounded="full" fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="wide" shadow="md">
                Most Popular
              </Box>
              <Text fontSize="2xl" fontWeight="700" color={textColor}>Pro</Text>
              <Text fontSize="6xl" fontWeight="900" my={4} color={textColor}>$10 <Text as="span" fontSize="xl" color={textMuted} fontWeight="500">/mo</Text></Text>
              <Text color={textMuted} mb={8} fontSize="lg">For serious freelancers scaling up.</Text>
              <Stack spacing={5} mb={10}>
                <Flex align="center">
                  <Icon as={MdCheckCircle} color="brand.500" w={6} h={6} mr={3} />
                  <Text color={textColor} fontWeight="700" fontSize="lg">Unlimited proposals</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={MdCheckCircle} color="brand.500" w={6} h={6} mr={3} />
                  <Text color={textColor} fontWeight="500" fontSize="lg">Premium Llama-3 Models</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={MdCheckCircle} color="brand.500" w={6} h={6} mr={3} />
                  <Text color={textColor} fontWeight="500" fontSize="lg">Priority email support</Text>
                </Flex>
              </Stack>
              <NavLink to="/auth/sign-up">
                <Button w="full" size="lg" h="60px" colorScheme="brand" rounded="full" fontSize="lg" fontWeight="700" shadow="xl">
                  Upgrade to Pro
                </Button>
              </NavLink>
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Box>

      {/* FAQ */}
      <Container maxW="container.md" py={24}>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" fontSize="4xl" color={textColor} fontWeight="800">
            Frequently Asked Questions
          </Heading>
        </VStack>
        <Accordion allowMultiple>
          {[
            { q: "Is the generated text detectable by AI scanners?", a: "We specifically prompt our models to write in a human, conversational tone that mimics successful freelance proposals. However, we always recommend you read through and add your own personal touch before sending." },
            { q: "Do I need to input my credit card for the free plan?", a: "Nope! The free plan is completely free. You get 5 proposals every single month. We only ask for payment if you decide to upgrade to Pro." },
            { q: "Can I cancel my Pro subscription anytime?", a: "Yes, you can cancel your subscription at any time directly from your dashboard settings. You will retain Pro access until the end of your billing cycle." },
            { q: "What job platforms does this work for?", a: "All of them! Whether you are pasting a job description from Upwork, Fiverr, LinkedIn, or a direct email from a client, the AI will analyze it and write a custom response." }
          ].map((faq, i) => (
            <AccordionItem key={i} border="none" mb={4} bg={cardBg} rounded="xl" shadow="sm">
              <AccordionButton py={6} px={6} _expanded={{ bg: 'brand.50', color: 'brand.600', roundedTop: 'xl' }}>
                <Box as="span" flex='1' textAlign='left' fontSize="lg" fontWeight="600" color={textColor}>
                  {faq.q}
                </Box>
                <AccordionIcon w={6} h={6} color="brand.500" />
              </AccordionButton>
              <AccordionPanel pb={6} px={6} color={textMuted} fontSize="md" lineHeight="tall">
                {faq.a}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>

      {/* Final CTA with Background Image */}
      <Box 
        position="relative" 
        py={32} 
        backgroundImage="url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment="fixed"
      >
        <Box position="absolute" top={0} left={0} w="100%" h="100%" bg="navy.900" opacity={0.85} zIndex={0} />
        
        <Container maxW="container.md" textAlign="center" position="relative" zIndex={1}>
          <Heading fontSize={{ base: '4xl', md: '5xl' }} color="white" fontWeight="800" mb={6}>
            Ready to scale your freelance business?
          </Heading>
          <Text fontSize="xl" color="gray.300" mb={10}>
            Join thousands of freelancers who are winning more jobs in less time.
          </Text>
          <NavLink to="/auth/sign-up">
            <Button size="lg" colorScheme="brand" rounded="full" h="70px" px={12} fontSize="xl" fontWeight="700" shadow="2xl" _hover={{ transform: 'scale(1.05)' }}>
              Create your free account today
            </Button>
          </NavLink>
        </Container>
      </Box>

      {/* Enhanced Footer */}
      <Box bg={cardBg} pt={20} pb={10} borderTop="1px solid" borderColor={borderColor}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={10} mb={16}>
            <Stack spacing={6}>
              <Flex align="center">
                <Icon as={MdAutoAwesome} color="brand.500" w={8} h={8} mr={2} />
                <Heading as="h3" size="md" color={textColor} fontWeight="800">
                  ProposalGen
                </Heading>
              </Flex>
              <Text color={textMuted} fontSize="sm">
                The ultimate AI assistant for top-tier freelancers looking to automate their client acquisition process.
              </Text>
            </Stack>
            
            <Stack align="flex-start">
              <Text fontWeight="700" color={textColor} mb={2}>Product</Text>
              <Button variant="link" color={textMuted} fontWeight="400">Features</Button>
              <Button variant="link" color={textMuted} fontWeight="400">Pricing</Button>
              <Button variant="link" color={textMuted} fontWeight="400">Success Stories</Button>
            </Stack>

            <Stack align="flex-start">
              <Text fontWeight="700" color={textColor} mb={2}>Resources</Text>
              <Button variant="link" color={textMuted} fontWeight="400">Blog</Button>
              <Button variant="link" color={textMuted} fontWeight="400">Freelance Guide</Button>
              <Button variant="link" color={textMuted} fontWeight="400">Help Center</Button>
            </Stack>

            <Stack align="flex-start">
              <Text fontWeight="700" color={textColor} mb={2}>Legal</Text>
              <Button variant="link" color={textMuted} fontWeight="400">Privacy Policy</Button>
              <Button variant="link" color={textMuted} fontWeight="400">Terms of Service</Button>
              <Button variant="link" color={textMuted} fontWeight="400">Contact Us</Button>
            </Stack>
          </SimpleGrid>

          <Box borderTop="1px solid" borderColor={borderColor} pt={8}>
            <Text textAlign="center" color={textMuted} fontSize="sm">
              © {new Date().getFullYear()} Proposal Generator. Built for freelancers. All rights reserved.
            </Text>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
