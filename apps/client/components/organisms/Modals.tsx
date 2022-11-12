import React from 'react';
import useModalStore from '../../store/ModalStore';
import DVSModal from '../molecules/DVSModal';
import DVSButton from '../atoms/DVSButton';
import { useTranslation } from 'next-i18next';
import { DVSFormInputProps } from '../atoms/DVSFormInput';

const Modals = () => {
  const { t } = useTranslation();
  const [isOpen, modal, setClosed] = useModalStore((s) => [s.isOpen, s.modal, s.setClosed]);

  const ModalProps = () => {
    const inputs: Record<Modal['type'], DVSFormInputProps[]> = {
      registerVoter: [
        {
          name: 'ssn',
          placeholder: t('auth.ssn'),
          variant: 'modal',
        },
      ],
    };

    const footer: Record<Modal['type'], React.ReactNode> = {
      registerVoter: (
        <>
          <DVSButton dvsType="secondary" colorScheme="gray" onClick={setClosed}>
            {t('controls.cancel')}
          </DVSButton>
          <DVSButton dvsType="primary" onClick={() => {}}>
            {t('modals.registerVoter.submit')}
          </DVSButton>
        </>
      ),
    };

    return {
      header: t(`modals.${modal?.type}.header`),
      text: t(`modals.${modal?.type}.text`),
      inputs: inputs[modal?.type],
      footer: footer[modal?.type],
    };
  };

  return <DVSModal isOpen={isOpen} onClose={setClosed} {...ModalProps()} />;
};

export default Modals;
