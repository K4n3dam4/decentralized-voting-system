import React from 'react';
import DVSFormCard from '../molecules/DVSFormCard';
import { DVSButtonProps } from '../atoms/DVSButton';
import { DVSFormInputProps } from '../atoms/DVSFormInput';
import useAuthStore from '../../store/AuthStore';
import { useRouter } from 'next/router';

const Register = () => {
  const router = useRouter();
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
      Register: [
        {
          name: 'firstName',
          placeholder: 'First name',
          value: firstName,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          error: errors['firstName'],
        },
        {
          name: 'lastName',
          placeholder: 'Last name',
          value: lastName,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          error: errors['lastName'],
        },
        {
          name: 'street',
          placeholder: 'Street',
          value: street,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          error: errors['street'],
        },
        {
          name: 'postalCode',
          placeholder: 'Postalcode',
          value: postalCode,
          onChange: ({ target }) => setAuth(target.name, Number(target.value)),
          onFocus: ({ target }) => setError(target.name),
          error: errors['postalCode'],
          type: 'number',
        },
        {
          name: 'city',
          placeholder: 'City',
          value: city,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          error: errors['city'],
        },
        {
          name: 'ssn',
          placeholder: 'Social security nunber',
          value: ssn,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          error: errors['ssn'],
        },
        {
          name: 'email',
          placeholder: 'Email address',
          value: email,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          type: 'email',
          error: errors['email'],
        },
        {
          name: 'password',
          placeholder: 'Password',
          value: password,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          type: 'password',
          error: errors['password'],
        },
        {
          name: 'passwordRepeat',
          placeholder: 'Repeat password',
          value: passwordRepeat,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          type: 'password',
          error: errors['passwordRepeat'],
        },
      ],
      Login: [
        {
          name: 'email',
          placeholder: 'Email address',
          value: email,
          onChange: ({ target }) => setAuth(target.name, target.value),
          onFocus: ({ target }) => setError(target.name),
          type: 'email',
          error: errors['email'],
        },
        {
          name: 'password',
          placeholder: 'Password',
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
      children: displayAuth,
      onClick: () => {
        if (displayAuth === 'Register') register(router);
        else login(router);
      },
    },
  ];
  return (
    <DVSFormCard
      heading={displayAuth}
      inputs={getInputs()}
      buttons={buttonProps}
      splitAtIndex={displayAuth === 'Register' && 5}
    />
  );
};

export default Register;
