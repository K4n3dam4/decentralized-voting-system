import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { ethers } from 'ethers';

export function IsObjectArray(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsArrayOfObjects',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return (
            Array.isArray(value) &&
            value.every((element: any) => element instanceof Object && !(element instanceof Array))
          );
        },
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `${validationArguments.property} must be an array of objects`,
      },
    });
  };
}

export function IsMnemonic(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsMnemonic',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          try {
            ethers.Wallet.fromMnemonic(value);
            return true;
          } catch {
            return false;
          }
        },
        defaultMessage: (): string => 'error.api.mnemonic.invalid',
      },
    });
  };
}
