import React from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Progress,
} from '@chakra-ui/react';
import { apiFetch } from 'lib/api';
import { useAuth } from 'contexts/AuthContext';

export default function UserProposal() {
  const toast = useToast();
  const { user } = useAuth();
  const textMuted = useColorModeValue('secondaryGray.600', 'secondaryGray.300');
  const [jobDescription, setJobDescription] = React.useState('');
  const [mySkills, setMySkills] = React.useState('');
  const [proposal, setProposal] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const upgradeRequired = React.useMemo(
    () => user?.plan === 'free',
    [user?.plan],
  );

  const usageCount = user?.proposalsUsedThisMonth || 0;
  const usageLimit = 5;
  const usagePercent = Math.min((usageCount / usageLimit) * 100, 100);

  async function handleGenerate() {
    setLoading(true);
    setProposal('');
    try {
      const data = await apiFetch('/api/proposals/generate', {
        method: 'POST',
        body: JSON.stringify({ jobDescription, mySkills }),
      });
      setProposal(data.proposal || '');
      toast({ title: 'Proposal ready', status: 'success', duration: 2000 });
    } catch (e) {
      if (e?.status === 402) {
        onOpen(); // Open the upgrade modal
      } else {
        toast({
          title: 'Generation failed',
          description: e?.message || 'Try again shortly.',
          status: 'error',
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade() {
    try {
      const data = await apiFetch('/api/billing/subscribe');
      const url = data.checkoutUrl;
      if (!url) {
        toast({ title: 'Checkout unavailable', status: 'error', duration: 4000 });
        return;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      toast({ title: 'Could not create checkout link', status: 'error', duration: 4000 });
    }
  }

  return (
    <Box pt={{ base: '130px', md: '90px', xl: '90px' }}>
      
      {/* Analytics Section */}
      <Card mb="24px">
        <CardBody>
          <Flex align="center" justify="space-between">
            <Box w="70%">
              <Text fontSize="lg" fontWeight="700" color={useColorModeValue('navy.700', 'white')}>
                Monthly Usage
              </Text>
              <Text fontSize="sm" color={textMuted} mb="8px">
                {upgradeRequired 
                  ? `You have used ${usageCount} out of ${usageLimit} free proposals.`
                  : 'You are on the Pro Plan. Unlimited proposals available.'}
              </Text>
              {upgradeRequired && (
                <Progress value={usagePercent} colorScheme="brand" size="sm" borderRadius="8px" />
              )}
            </Box>
            {upgradeRequired && (
              <Button colorScheme="brand" onClick={onOpen}>
                Upgrade Plan
              </Button>
            )}
          </Flex>
        </CardBody>
      </Card>

      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="24px">
        <Card>
          <CardBody>
            <Text fontSize="xl" fontWeight="700" mb="12px">
              Job description
            </Text>
            <Text mb="14px" color={textMuted} fontSize="sm">
 Paste the posting you are replying to. We will focus on client pain points, not buzzwords.


            </Text>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              minH="200px"
              variant="outline"
              fontSize="sm"
              mb="22px"
            />
            <Text fontSize="xl" fontWeight="700" mb="12px">
              Your strengths
            </Text>
            <Text mb="14px" color={textMuted} fontSize="sm">
 Highlight only what is relevant.


            </Text>
            <Textarea
              value={mySkills}
              onChange={(e) => setMySkills(e.target.value)}
              minH="120px"
              variant="outline"
              fontSize="sm"
              mb="20px"
            />
            {upgradeRequired ? (
              <Alert status="info" borderRadius="16px" mb="14px">
                <AlertIcon />
                Free plan includes a capped number of drafts each month. Upgrade for unlimited drafts when you are ready.
              </Alert>
            ) : null}
            <Button
              variant="brand"
              w="full"
              h="54px"
              onClick={handleGenerate}
              isLoading={loading}
              mb="14px"
            >
              Generate proposal


            </Button>
            {upgradeRequired ? (
              <Button variant="outline" w="full" onClick={onOpen}>
                Upgrade with Lemon Squeezy
              </Button>
            ) : null}
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="xl" fontWeight="700" mb="12px">
              Output


            </Text>
            <Text mb="14px" color={textMuted} fontSize="sm">
              Returned text only, ready to tweak and send.


            </Text>
            <Box
              borderRadius="16px"
              borderWidth="1px"
              borderColor="secondaryGray.200"
              px="16px"
              py="16px"
              minH="360px"
              whiteSpace="pre-wrap"
              fontSize="sm"
            >
              {proposal || (
                <Text color={textMuted}>Your proposal will render here.


                </Text>
              )}
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Upgrade Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Upgrade to Pro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              You have reached your free limit for the month! Upgrade to the Pro Plan to instantly unlock unlimited AI proposal generations.
            </Text>
            <Alert status="success" borderRadius="10px">
              <AlertIcon />
              Gain an unfair advantage and win more clients.
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleUpgrade}>
              Checkout securely
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
