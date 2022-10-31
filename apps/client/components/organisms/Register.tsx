import React from 'react';
import DVSFormCard from '../molecules/DVSFormCard';
import { DVSButtonProps } from '../atoms/DVSButton';
import { DVSFormInputProps } from '../atoms/DVSFormInput';
import useAuthStore from '../../store/AuthStore';

const Register = () => {
  const [firstName, lastName, street, postalCode, city, ssn, email, password, passwordRepeat, setRegister] =
    useAuthStore((s) => [
      s.firstName,
      s.lastName,
      s.street,
      s.postalCode,
      s.city,
      s.ssn,
      s.email,
      s.password,
      s.passwordRepeat,
      s.setRegister,
    ]);
  const errors = useAuthStore((s) => s.errors);

  const inputProps: DVSFormInputProps[] = [
    {
      name: 'firstName',
      placeholder: 'First name',
      value: firstName,
      onChange: ({ target }) => setRegister(target.name, target.value),
      error: errors['firstName'],
    },
    {
      name: 'lastName',
      placeholder: 'Last name',
      value: lastName,
      onChange: ({ target }) => setRegister(target.name, target.value),
      error: errors['lastName'],
    },
    {
      name: 'street',
      placeholder: 'Street',
      value: street,
      onChange: ({ target }) => setRegister(target.name, target.value),
      error: errors['street'],
    },
    {
      name: 'postalCode',
      placeholder: 'Postalcode',
      value: postalCode,
      onChange: ({ target }) => setRegister(target.name, target.value),
      error: errors['postalCode'],
    },
    {
      name: 'city',
      placeholder: 'City',
      value: city,
      onChange: ({ target }) => setRegister(target.name, target.value),
      error: errors['city'],
    },
    {
      name: 'ssn',
      placeholder: 'Social security nunber',
      value: ssn,
      onChange: ({ target }) => setRegister(target.name, target.value),
      error: errors['ssn'],
    },
    {
      name: 'email',
      placeholder: 'Email address',
      value: email,
      onChange: ({ target }) => setRegister(target.name, target.value),
      type: 'email',
      error: errors['email'],
    },
    {
      name: 'password',
      placeholder: 'Password',
      value: password,
      onChange: ({ target }) => setRegister(target.name, target.value),
      type: 'password',
      error: errors['password'],
    },
    {
      name: 'passwordRepeat',
      placeholder: 'Repeat password',
      value: passwordRepeat,
      onChange: ({ target }) => setRegister(target.name, target.value),
      type: 'password',
      error: errors['passwordRepeat'],
    },
  ];

  const buttonProps: DVSButtonProps[] = [
    {
      dvsType: 'primary',
      children: 'Register',
    },
  ];
  return (
    <DVSFormCard
      heading="Register"
      description="Register today and experience the ease of securely voting from home."
      inputs={inputProps}
      buttons={buttonProps}
      splitAtIndex={5}
    />
  );
};

export default Register;
