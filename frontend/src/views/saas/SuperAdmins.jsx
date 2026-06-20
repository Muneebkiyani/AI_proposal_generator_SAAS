import React from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { apiFetch } from 'lib/api';

export default function SuperAdmins() {
  const toast = useToast();
  const heading = useColorModeValue('navy.700', 'white');
  const muted = useColorModeValue('secondaryGray.600', 'secondaryGray.300');
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/super-admin/admins');
      setRows(data.users || []);
    } catch {
      toast({ title: 'Could not load admins', status: 'error', duration: 4000 });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleCreateAdmin(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await apiFetch('/api/super-admin/admins', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setEmail('');
      setPassword('');
      toast({ title: 'Admin created', status: 'success', duration: 3000 });
      load();
    } catch (err) {
      toast({
        title: 'Could not create admin',
        description: err?.data?.error || err?.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box pt={{ base: '130px', md: '90px', xl: '90px' }}>
      <Text fontSize="2xl" fontWeight="800" color={heading} mb="8px">
        Admin team


      </Text>
      <Text color={muted} fontSize="sm" mb="22px">
        Create delegated operators that can manage customer access.


      </Text>

      <Card mb="26px">
        <CardBody as="form" onSubmit={handleCreateAdmin}>
          <Flex direction={{ base: 'column', md: 'row' }} gap="16px" mb="14px">
            <FormControl>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input variant="outline" size="lg" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Temporary password</FormLabel>
              <Input variant="outline" size="lg" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
          </Flex>
          <Button type="submit" variant="brand" h="50px" isLoading={busy}>
            Create admin


          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          {loading ? (
            <Flex justify="center" py="40px">
              <Spinner size="lg" />
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Email</Th>
                    <Th>Created</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {rows.map((u) => (
                    <Tr key={u.id}>
                      <Td fontWeight="600">{u.email}</Td>
                      <Td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}
