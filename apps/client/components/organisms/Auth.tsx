import React from 'react';
import DVSFormCard from '../molecules/DVSFormCard';
import { DVSButtonProps } from '../atoms/DVSButton';
import { DVSFormInputProps } from '../atoms/DVSFormInput';
import useAuthStore from '../../store/AuthStore';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { DVSToast } from '../atoms/DVSToast';

const Auth = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { showToast } = DVSToast();

  const [displayAuth, firstName, lastName, street, postalCode, city, ssn, email, password, passwordRepeat, errors] =
    useAuthStore((s) => [
      s.displayAuth,

      s.firstName,
      s.lastName,
      s.street,
      s.postalCode,
      s.city,
      s.ssn,
      s.email,
      s.password,
      s.passwordRepeat,

      s.errors,
    ]);
  const [setAuth, register, login, setError] = useAuthStore((s) => [s.setAuth, s.register, s.login, s.setError]);

  const getInputs = () => {
    const inputs: { [type: string]: DVSFormInputProps[] } = {
      register: [
        {
          name: 'firstName',
          placeholder: t('auth.firstName'),
          value: firstName,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          error: errors['firstName'],
        },
        {
          name: 'lastName',
          placeholder: t('auth.lastName'),
          value: lastName,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          error: errors['lastName'],
        },
        {
          name: 'street',
          placeholder: t('auth.street'),
          value: street,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          error: errors['street'],
        },
        {
          name: 'postalCode',
          placeholder: t('auth.postalCode'),
          value: postalCode,
          onChange: ({ target }) => setAuth(target.name, Number(target.value)),
          onFocus: ({ target }) => setError(target.name),
          error: errors['postalCode'],
          type: 'number',
        },
        {
          name: 'city',
          placeholder: t('auth.city'),
          value: city,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          error: errors['city'],
        },
        {
          name: 'ssn',
          placeholder: t('auth.ssn'),
          value: ssn,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          error: errors['ssn'],
        },
        {
          name: 'email',
          placeholder: t('auth.email'),
          value: email,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          type: 'email',
          error: errors['email'],
        },
        {
          name: 'password',
          placeholder: t('auth.password'),
          value: password,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          type: 'password',
          error: errors['password'],
        },
        {
          name: 'passwordRepeat',
          placeholder: t('auth.passwordRepeat'),
          value: passwordRepeat,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          type: 'password',
          error: errors['passwordRepeat'],
        },
      ],
      login: [
        {
          name: 'email',
          placeholder: t('auth.email'),
          value: email,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          type: 'email',
          error: errors['email'],
        },
        {
          name: 'password',
          placeholder: t('auth.password'),
          value: password,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          type: 'password',
          error: errors['password'],
        },
      ],
    };

    return inputs[displayAuth];
  };

  const buttonProps: DVSButtonProps[] = [
    {
      dvsType: 'primary',
      children: t(`auth.${displayAuth}`),
      onClick: () => {
        if (displayAuth === 'register') register(router, showToast);
        else login(router, showToast);
      },
    },
  ];
  return (
    <DVSFormCard
      heading={t(`auth.${displayAuth}`)}
      inputs={getInputs()}
      buttons={buttonProps}
      splitAtIndex={displayAuth === 'register' && 5}
    />
  );
};

export default Auth;
