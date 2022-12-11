import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import useAdminUserStore from '../../store/AdminUserStore';
import useAdminElectionStore from '../../store/AdminElectionStore';
import { DVSButtonProps } from '../atoms/DVSButton';
import DVSAdminCreate, { DVSAdminCreateProps } from '../molecules/DVSAdminCreate';
import { Box, Heading, Stack } from '@chakra-ui/react';
import DVSAdminDataDisplay from '../molecules/DVSAdminDataDisplay';
import DVSExpiration from '../atoms/DVSExpiration';
import { config } from '../../config/config';
import { useRouter } from 'next/router';
import { DVSToast } from '../atoms/DVSToast';

export interface AdminCreateProps {
  type: 'election' | 'user';
}

const AdminCreate: React.FC<AdminCreateProps> = ({ type }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showToast } = DVSToast();

  const [name, image, description, candidates, eligibleVoters, expires, setElection, createElection, resetElection] =
    useAdminElectionStore((s) => [
      s.name,
      s.image,
      s.description,
      s.candidates,
      s.eligibleVoters,
      s.expires,
      s.setElection,
      s.createElection,
      s.reset,
    ]);
  const [electionErrors, setElectionError] = useAdminElectionStore((s) => [s.errors, s.setError]);

  const [firstName, lastName, street, postalCode, city, ssn, email, password, passwordRepeat, setUser] =
    useAdminUserStore((s) => [
      s.firstName,
      s.lastName,
      s.street,
      s.postalCode,
      s.city,
      s.ssn,
      s.email,
      s.password,
      s.passwordRepeat,
      s.setUser,
    ]);
  const [userErrors, setUserError] = useAdminUserStore((s) => [s.errors, s.setError]);

  useEffect(() => {
    return () => {
      resetElection();
    };
  }, []);

  const renderCreateInputs = () => {
    const inputs: Record<AdminCreateProps['type'], DVSAdminCreateProps['inputs']> = {
      election: [
        {
          name: 'name',
          placeholder: t('admin.create.election.name'),
          value: name,
          customType: 'input',
          onChange: ({ target }) => setElection(target.name, target.value),
          onFocus: ({ target }) => setElectionError(target.name),
          error: electionErrors['name'],
          variant: 'lighter',
        },
        {
          name: 'description',
          placeholder: t('admin.create.election.description'),
          value: description,
          customType: 'textarea',
          onChange: ({ target }) => setElection(target.name, target.value),
          onFocus: ({ target }) => setElectionError(target.name),
          error: electionErrors['description'],
        },
        {
          name: 'image',
          placeholder: t('admin.create.election.image'),
          value: image,
          customType: 'input',
          onChange: ({ target }) => setElection(target.name, target.value),
          onFocus: ({ target }) => setElectionError(target.name),
          error: electionErrors['image'],
          variant: 'lighter',
        },
        {
          name: 'candidates',
          placeholder: t('admin.create.election.candidates'),
          value: candidates,
          customType: 'candidates',
          onChange: ({ target }) => setElection(target.name, target.value),
          onFocus: ({ target }) => setElectionError(target.name),
          error: electionErrors['candidates'],
          type: 'candidate',
          variant: 'lighter',
        },
        {
          name: 'eligibleVoters',
          placeholder: t('admin.create.election.eligibleVoters'),
          value: eligibleVoters,
          customType: 'textarea',
          onChange: ({ target }) => setElection(target.name, target.value),
          onFocus: ({ target }) => setElectionError(target.name),
          error: electionErrors['eligibleVoters'],
        },
        {
          name: 'expires',
          placeholder: t('admin.create.election.description'),
          value: expires,
          customType: 'input',
          onChange: ({ target }) => setElection(target.name, target.value),
          onFocus: ({ target }) => setElectionError(target.name),
          error: electionErrors['expires'],
          type: 'datetime-local',
          step: 1,
          variant: 'lighter',
        },
      ],
      user: [
        {
          name: 'firstName',
          placeholder: t('auth.firstName'),
          value: firstName,
          customType: 'input',
          onChange: ({ target }) => setUser(target.name, target.value),
          onFocus: ({ target }) => setUserError(target.name),
          error: userErrors['firstName'],
          variant: 'lighter',
        },
        {
          name: 'lastName',
          placeholder: t('auth.lastName'),
          value: lastName,
          customType: 'input',
          onChange: ({ target }) => setUser(target.name, target.value),
          onFocus: ({ target }) => setUserError(target.name),
          error: userErrors['lastName'],
          variant: 'lighter',
        },
        {
          name: 'street',
          placeholder: t('auth.street'),
          value: street,
          customType: 'input',
          onChange: ({ target }) => setUser(target.name, target.value),
          onFocus: ({ target }) => setUserError(target.name),
          error: userErrors['street'],
          variant: 'lighter',
        },
        {
          name: 'postalCode',
          placeholder: t('auth.postalCode'),
          value: postalCode,
          customType: 'input',
          onChange: ({ target }) => setUser(target.name, Number(target.value)),
          onFocus: ({ target }) => setUserError(target.name),
          error: userErrors['postalCode'],
          type: 'number',
          variant: 'lighter',
        },
        {
          name: 'city',
          placeholder: t('auth.city'),
          value: city,
          customType: 'input',
          onChange: ({ target }) => setUser(target.name, target.value),
          onFocus: ({ target }) => setUserError(target.name),
          error: userErrors['city'],
          variant: 'lighter',
        },
        {
          name: 'ssn',
          placeholder: t('auth.ssn'),
          value: ssn,
          customType: 'input',
          onChange: ({ target }) => setUser(target.name, target.value),
          onFocus: ({ target }) => setUserError(target.name),
          error: userErrors['ssn'],
          variant: 'lighter',
        },
        {
          name: 'email',
          placeholder: t('auth.email'),
          value: email,
          customType: 'input',
          onChange: ({ target }) => setUser(target.name, target.value),
          onFocus: ({ target }) => setUserError(target.name),
          type: 'email',
          error: userErrors['email'],
          variant: 'lighter',
        },
        {
          name: 'password',
          placeholder: t('auth.password'),
          value: password,
          customType: 'input',
          onChange: ({ target }) => setUser(target.name, target.value),
          onFocus: ({ target }) => setUserError(target.name),
          type: 'password',
          error: userErrors['password'],
          variant: 'lighter',
        },
        {
          name: 'passwordRepeat',
          placeholder: t('auth.passwordRepeat'),
          value: passwordRepeat,
          customType: 'input',
          onChange: ({ target }) => setUser(target.name, target.value),
          onFocus: ({ target }) => setUserError(target.name),
          type: 'password',
          error: userErrors['passwordRepeat'],
          variant: 'lighter',
        },
      ],
    };

    return inputs[type];
  };

  const renderData = () => {
    switch (type) {
      case 'election': {
        const buttons: DVSButtonProps[] = [
          {
            dvsType: 'secondary',
            children: 'Reset',
            onClick: resetElection,
          },
          {
            dvsType: 'primary',
            children: 'Create',
            onClick: () => createElection(router, showToast),
          },
        ];
        const empty = !name && !expires && !description && candidates.length < 1;
        return (
          <Stack spacing={empty ? 0 : 5} direction="row">
            <DVSAdminCreate
              maxH="620px"
              w={empty ? '100%' : '60%'}
              overflowY="auto"
              heading={t(`admin.create.${type}.heading`)}
              description={t(`admin.create.${type}.descr`)}
              inputs={renderCreateInputs()}
              transition="500ms"
            />
            <DVSAdminDataDisplay
              card={{
                w: empty ? '0%' : '40%',
                maxH: '620px',
                overflowY: 'auto',
                transition: '500ms',
              }}
              headerImage={
                <DVSAdminDataDisplay.HeaderImage src={image} fallbackSrc={config.get('electionImageFallback')} />
              }
              buttons={buttons}
            >
              <Stack>
                <Heading size="lg">{name}</Heading>
                {expires && <DVSExpiration value={expires} />}
              </Stack>
              <DVSAdminDataDisplay.Data>{description}</DVSAdminDataDisplay.Data>
              <DVSAdminDataDisplay.Candidates candidates={candidates} />
            </DVSAdminDataDisplay>
          </Stack>
        );
      }
    }
  };

  return <Box>{renderData()}</Box>;
};

export default AdminCreate;
