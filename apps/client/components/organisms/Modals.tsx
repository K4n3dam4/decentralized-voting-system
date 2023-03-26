import React from 'react';
import useModalStore from '../../store/ModalStore';
import DVSModal from '../molecules/DVSModal';
import DVSButton from '../atoms/DVSButton';
import { useTranslation } from 'next-i18next';
import DVSFormInput, { DVSFormInputProps } from '../atoms/DVSFormInput';
import { Button, SimpleGrid } from '@chakra-ui/react';
import useElectionStore from '../../store/ElectionStore';
import { useRouter } from 'next/router';
import DVSAlert from '../molecules/DVSAlert';
import { DVSToast } from '../atoms/DVSToast';
import makeRequest, { apiError, createBearer } from '../../utils/makeRequest';
import useUserStore from '../../store/UserStore';
import DVSLoadingSpinner from '../molecules/DVSLoadingSpinner';

const Modals = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showToast } = DVSToast();

  const [isOpen, modal, setClosed, setOpen] = useModalStore((s) => [s.isOpen, s.modal, s.setClosed, s.setOpen]);
  const token = useUserStore((s) => s.access_token);
  const [mnemonic, errors, setSSN, registerVoter, setMnemonic, vote, resetElectionStore, setElectionError] =
    useElectionStore((s) => [
      s.mnemonic,
      s.errors,
      s.setSSN,
      s.registerVoter,
      s.setMnemonic,
      s.vote,
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
    let headerArgs: Record<string, any>;
    let textArgs: Record<string, any>;

    switch (modal?.type) {
      case 'loading':
        {
          children = <DVSLoadingSpinner>{modal?.payload}</DVSLoadingSpinner>;
        }
        break;
      case 'registerVoter':
        {
          inputs = [
            {
              name: 'ssn',
              placeholder: t('auth.ssn'),
              onChange: (e) => setSSN(e.target.value),
              onFocus: (e) => setElectionError(e.target.name),
              error: errors['ssn'],
              variant: 'lighter',
            },
          ];
          footer = (
            <DVSButton dvsType="primary" onClick={() => registerVoter(modal.payload.id, router, showToast)}>
              {t('modals.registerVoter.submit')}
            </DVSButton>
          );
        }
        break;
      case 'mnemonic':
        {
          children = (
            <SimpleGrid columns={4} spacing={4}>
              {modal.payload.map((word, index) => (
                <DVSFormInput key={`mnemonic-word-${index}`} isDisabled value={word} variant="lighter" />
              ))}
            </SimpleGrid>
          );
        }
        break;
      case 'vote':
        {
          headerArgs = { name: modal.payload.candidate.name };
          textArgs = { name: modal.payload.candidate.name };
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
                    variant="lighter"
                  />
                ))}
              </SimpleGrid>
              {errors['mnemonic'] && (
                <DVSAlert mt={5} status="error">
                  {errors['mnemonic']}
                </DVSAlert>
              )}
              <DVSAlert mt={5} status="info">
                {t('modals.vote.warning')}
              </DVSAlert>
            </>
          );
          footer = (
            <DVSButton
              dvsType="primary"
              onClick={() => vote(modal.payload.electionId, modal.payload.index, router, showToast)}
            >
              {t('modals.vote.submit')}
            </DVSButton>
          );
        }
        break;
      case 'closeElection': {
        const { name, id } = modal.payload;
        headerArgs = { name };
        textArgs = { name };

        const handleCloseElection = async () => {
          try {
            setOpen({ type: 'loading', payload: 'Closing election...' });
            await makeRequest({ url: `admin/election/close/${id}`, method: 'PUT', headers: createBearer(token) });
            const { asPath } = router;
            await router.push(asPath);
            setClosed();
            showToast({ status: 'success', description: t('success.admin.election.close', { name }) });
          } catch (error) {
            setClosed();
            showToast({ status: 'error', description: t(apiError(error)) });
          }
        };

        children = (
          <DVSAlert mt={5} status="info">
            {t('modals.closeElection.warning')}
          </DVSAlert>
        );

        footer = (
          <Button colorScheme="red" onClick={handleCloseElection}>
            {t('modals.closeElection.submit')}
          </Button>
        );
      }
    }

    return {
      header: t(`modals.${modal?.type}.header`, { ...(headerArgs && headerArgs) }),
      text: t(`modals.${modal?.type}.text`, { ...(textArgs && textArgs) }),
      inputs,
      children,
      footer,
    };
  };

  return <DVSModal isOpen={isOpen} onClose={handleClose} {...ModalProps()} />;
};

export default Modals;
