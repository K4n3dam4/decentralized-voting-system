import React from 'react';
import useModalStore from '../../store/ModalStore';
import DVSModal from '../molecules/DVSModal';
import DVSButton from '../atoms/DVSButton';
import { useTranslation } from 'next-i18next';
import DVSFormInput, { DVSFormInputProps } from '../atoms/DVSFormInput';
import { SimpleGrid } from '@chakra-ui/react';
import useElectionStore from '../../store/ElectionStore';
import { useRouter } from 'next/router';
import DVSAlert from '../molecules/DVSAlert';

const Modals = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isOpen, modal, setOpen, setClosed] = useModalStore((s) => [s.isOpen, s.modal, s.setOpen, s.setClosed]);
  const [mnemonic, errors, setSSN, registerVoter, setMnemonic, submitMnemonic, resetElectionStore, setElectionError] =
    useElectionStore((s) => [
      s.mnemonic,
      s.errors,
      s.setSSN,
      s.registerVoter,
      s.setMnemonic,
      s.submitMnemonic,
      s.reset,
      s.setError,
    ]);

  const handleClose = () => {
    resetElectionStore();
    setClosed();
  };

  const ModalProps = () => {
    let inputs: DVSFormInputProps[];
    let footer: React.ReactNode;
    let children: React.ReactNode;

    switch (modal?.type) {
      case 'registerVoter':
        {
          inputs = [
            {
              name: 'ssn',
              placeholder: t('auth.ssn'),
              variant: 'modal',
              onChange: (e) => setSSN(e.target.value),
              onFocus: (e) => setElectionError(e.target.name),
              error: errors['ssn'],
            },
          ];
          footer = (
            <>
              <DVSButton dvsType="secondary" onClick={() => setOpen({ type: 'enterMnemonic', payload: modal.payload })}>
                {t('modals.registerVoter.option')}
              </DVSButton>
              <DVSButton dvsType="primary" onClick={() => registerVoter(modal.payload.id, router)}>
                {t('modals.registerVoter.submit')}
              </DVSButton>
            </>
          );
        }
        break;
      case 'enterMnemonic':
        {
          children = (
            <>
              <SimpleGrid columns={4} spacing={4}>
                {mnemonic.map((word, index) => (
                  <DVSFormInput
                    key={`mnemonic-word-${index}`}
                    placeholder={`${index + 1}`}
                    value={mnemonic[index]}
                    onChange={(e) => setMnemonic(index, e.target.value)}
                    onFocus={() => setElectionError('mnemonic')}
                    variant="modal"
                  />
                ))}
              </SimpleGrid>
              {errors['mnemonic'] && (
                <DVSAlert mt={5} status="error">
                  {errors['mnemonic']}
                </DVSAlert>
              )}
            </>
          );
          footer = (
            <>
              <DVSButton
                dvsType="secondary"
                colorScheme="gray"
                onClick={() => setOpen({ type: 'registerVoter', payload: modal.payload })}
              >
                {t('controls.back')}
              </DVSButton>
              <DVSButton dvsType="primary" onClick={submitMnemonic}>
                {t('modals.enterMnemonic.submit')}
              </DVSButton>
            </>
          );
        }
        break;
      case 'mnemonic': {
        children = (
          <SimpleGrid columns={4} spacing={4}>
            {modal.payload.map((word, index) => (
              <DVSFormInput key={`mnemonic-word-${index}`} isDisabled value={word} variant="modal" />
            ))}
          </SimpleGrid>
        );
      }
    }

    return {
      header: t(`modals.${modal?.type}.header`),
      text: t(`modals.${modal?.type}.text`),
      inputs,
      children,
      footer,
    };
  };

  return <DVSModal isOpen={isOpen} onClose={handleClose} {...ModalProps()} />;
};

export default Modals;
