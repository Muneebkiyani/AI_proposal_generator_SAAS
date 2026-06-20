import React from 'react';
import {
  Badge,
  Box,
  Card,
  CardBody,
  Flex,
  Select,
  Spinner,
  Switch,
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

export default function SuperUsers() {
  const toast = useToast();
  const heading = useColorModeValue('navy.700', 'white');
  const muted = useColorModeValue('secondaryGray.600', 'secondaryGray.300');
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/super-admin/users');
      setRows(data.users || []);
    } catch {
      toast({ title: 'Could not load users', status: 'error', duration: 4000 });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function toggleAccess(userId, restricted) {
    setBusy(`r-${userId}`);
    try {
      await apiFetch(`/api/super-admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ accessRestricted: restricted }),
      });
      setRows((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, accessRestricted: restricted } : u)),
      );
      toast({ title: 'Updated', status: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Update failed', status: 'error', duration: 4000 });
    } finally {
      setBusy(null);
    }
  }

  async function changePlan(userId, plan) {
    setBusy(`p-${userId}`);
    try {
      await apiFetch(`/api/super-admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ plan }),
      });
      setRows((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, plan } : u)),
      );
      toast({ title: 'Plan updated', status: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Could not update plan', status: 'error', duration: 4000 });
    } finally {
      setBusy(null);
    }
  }

  return (
    <Box pt={{ base: '130px', md: '90px', xl: '90px' }}>
      <Text fontSize="2xl" fontWeight="800" color={heading} mb="8px">
        All customers
      </Text>
      <Text color={muted} fontSize="sm" mb="22px">
        Manage overrides and auditing. Paid state should mirror Lemon webhooks whenever possible.
      </Text>
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
                    <Th>Plan</Th>
                    <Th>Usage</Th>
                    <Th>Restricted</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {rows.map((u) => (
                    <Tr key={u.id}>
                      <Td fontWeight="600">{u.email}</Td>
                      <Td minW="150px">
                        <Select
                          size="sm"
                          value={u.plan}
                          isDisabled={busy === `p-${u.id}`}
                          onChange={(e) => changePlan(u.id, e.target.value)}
                        >
                          <option value="free">free</option>
                          <option value="pro">pro</option>
                        </Select>
                      </Td>
                      <Td>
                        <Badge colorScheme="purple">{u.proposalsUsedThisMonth}</Badge>
                      </Td>
                      <Td>
                        <Switch
                          colorScheme="brandScheme"
                          isChecked={u.accessRestricted}
                          isDisabled={busy === `r-${u.id}`}
                          onChange={(e) => toggleAccess(u.id, e.target.checked)}
                        />
                      </Td>
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
