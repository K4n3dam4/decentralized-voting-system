import React from 'react';
import {
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

export interface DVSModalProps extends Omit<ModalProps, 'children'> {
  header: string;
  children?: React.ReactNode | React.ReactNode[];
  text?: string;
  inputs?: DVSFormInputProps[];
  footer?: React.ReactNode;
}

const DVSModal: React.FC<DVSModalProps> = ({ onClose, header, text, inputs, children, footer, ...modalProps }) => {
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
        <ModalFooter>{CustomFooter}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DVSModal;
