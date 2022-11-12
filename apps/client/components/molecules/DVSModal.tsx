import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
} from '@chakra-ui/react';
import DVSFormInput, { DVSFormInputProps } from '../atoms/DVSFormInput';
import { useTranslation } from 'next-i18next';

export interface DVSModalProps extends Omit<ModalProps, 'children'> {
  header: string;
  children?: React.ReactNode | React.ReactNode[];
  text?: string;
  inputs?: DVSFormInputProps[];
  footer?: React.ReactNode;
}

const DVSModal: React.FC<DVSModalProps> = ({ onClose, header, text, inputs, children, footer, ...modalProps }) => {
  const { t } = useTranslation();
  const DefaultFooter = (
    <Stack direction="row" spacing={5}>
      <Button onClick={onClose}>{t('controls.close')}</Button>
    </Stack>
  );

  const CustomFooter = footer && (
    <Stack direction="row" spacing={4}>
      {footer}
    </Stack>
  );

  const Inputs = inputs && inputs.map((props, index) => <DVSFormInput key={`modal-inout-${index}`} {...props} />);

  return (
    <Modal onClose={onClose} {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {text && <p>{text}</p>}
          {Inputs}
          {children}
        </ModalBody>
        <ModalFooter>{CustomFooter || DefaultFooter}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DVSModal;
