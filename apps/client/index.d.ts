/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

interface ValidateParam {
  field: string;
  value: string;
  validationType: validationType[];
}
type validationType = 'notEmpty' | 'string' | 'email' | 'password' | 'passwordRepeat';
interface validationFactoryParams {
  fields: Record<string, any>;
  validationTypes: { field: string; validationType: validationType[] }[];
}
type buttonType = 'primary' | 'secondary';
