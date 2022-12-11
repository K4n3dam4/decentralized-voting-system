import React, { useState } from 'react';
import { Heading, Stack, SimpleGrid, Tooltip, Text, Button } from '@chakra-ui/react';
import DVSAdminDataDisplay from '../molecules/DVSAdminDataDisplay';
import { config } from '../../config/config';
import DVSExpiration from '../atoms/DVSExpiration';
import { FaPersonBooth, FaUniversalAccess, FaLock } from 'react-icons/fa';
import { IoMdCreate } from 'react-icons/io';
import { Icon } from '@chakra-ui/icons';
import { useTranslation } from 'next-i18next';

export type AdminListProps = { type: 'election'; list: AdminElection[] } | { type: 'user'; list: [] };

const AdminList: React.FC<AdminListProps> = ({ type, list }) => {
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState<number>(null);

  const handleMouseEnter = (index: number) => setShowActions(index);

  const List = () => {
    switch (type) {
      case 'election': {
        return list.map(
          ({ image, name, expires, description, candidates, totalEligibleVoters, totalRegisteredVoters }, index) => {
            const actions = (
              <DVSAdminDataDisplay.Actions
                show={showActions === index}
                display="flex"
                flexDirection={{ base: 'row', lg: 'column', xl: 'row' }}
                justifyContent="space-between"
                h={{ base: '80px', lg: '120px', xl: '80px' }}
              >
                <Stack direction="row" spacing={3}>
                  <Tooltip mr={2} hasArrow label={t('admin.list.election.totalEligibleVoters')}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Icon as={FaUniversalAccess} />
                      <Text>{totalEligibleVoters}</Text>
                    </Stack>
                  </Tooltip>
                  <Tooltip hasArrow label={t('admin.list.election.totalRegisteredVoters')}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Icon as={FaPersonBooth} />
                      <Text>{totalRegisteredVoters}</Text>
                    </Stack>
                  </Tooltip>
                </Stack>
                <Stack direction="row" spacing={2}>
                  {/*<IconButton*/}
                  {/*  aria-label="Statistics"*/}
                  {/*  variant="outline"*/}
                  {/*  icon={<Icon as={IoIosStats} />}*/}
                  {/*  colorScheme="blue"*/}
                  {/*/>*/}
                  <Button colorScheme="red" variant="outline" leftIcon={<Icon as={FaLock} />}>
                    {t('admin.list.election.close')}
                  </Button>
                  <Button colorScheme="green" variant="outline" leftIcon={<Icon as={IoMdCreate} />}>
                    {t('admin.list.election.edit')}
                  </Button>
                </Stack>
              </DVSAdminDataDisplay.Actions>
            );

            return (
              <DVSAdminDataDisplay
                card={{
                  h: { base: 'auto', lg: 'full' },
                  overflowY: 'auto',
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseEnter(null)}
                key={`election-card-${index}`}
                h={{ base: 'auto', lg: '620px' }}
                headerImage={
                  <DVSAdminDataDisplay.HeaderImage
                    h="300px"
                    transition="500ms ease"
                    translateX={!actions ? 0 : 'full'}
                    src={image}
                    fallbackSrc={config.get('electionImageFallback')}
                  />
                }
                actions={actions}
              >
                <Stack>
                  <Heading size="lg">{name}</Heading>
                  {expires && <DVSExpiration tagSize="lg" value={expires} />}
                </Stack>
                <DVSAdminDataDisplay.Data>{description}</DVSAdminDataDisplay.Data>
                <DVSAdminDataDisplay.Candidates candidates={candidates} />
              </DVSAdminDataDisplay>
            );
          },
        );
      }
    }
  };

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 10, lg: 5 }}>
      {List()}
    </SimpleGrid>
  );
};

export default AdminList;
