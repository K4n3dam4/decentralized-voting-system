import React, { useEffect } from 'react';
import {
  Box,
  Stack,
  Flex,
  IconButton,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import DVSMenuLink, { DVSMenuLinkProps } from '../atoms/DVSMenuLink';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';

export interface DVSSidebarProps {
  menuLinks: DVSMenuLinkProps[];
  dividers?: { name: string; index: number; icon?: React.ReactNode }[];
}

const DVSSidebar: React.FC<DVSSidebarProps> = ({ menuLinks, dividers = [] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isWide] = useMediaQuery('(min-width: 800px)');

  useEffect(() => {
    if (isWide && !isOpen) onOpen();
    if (!isWide && isOpen) onClose();
  }, [isWide]);

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} w={{ base: 'auto', md: isOpen ? 60 : 'auto' }} h="full">
      <Flex p={5} h="full" flexDirection="column" justifyContent="space-between">
        <Stack spacing={4}>
          {menuLinks.map((link, index) => {
            const divider = dividers.find((dvd) => dvd.index === index);

            return (
              <>
                {divider && (isOpen ? <Heading fontSize="md">{divider.name}</Heading> : <Divider />)}
                <DVSMenuLink key={`sidebar-link-${index}`} compact={!isOpen} {...link} />
              </>
            );
          })}
        </Stack>
        <Flex justifyContent="flex-end">
          <IconButton
            size="xs"
            aria-label="sidebar-collapse"
            icon={<Icon as={isOpen ? BsArrowBarLeft : BsArrowBarRight} />}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default DVSSidebar;
