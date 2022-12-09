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
type validationType = 'notEmpty' | 'string' | 'email' | 'password' | 'passwordRepeat' | 'mnemonic';
interface validationFactoryParams {
  fields: Record<string, any>;
  validationTypes: { field: string; validationType: validationType[] }[];
}
type buttonType = 'primary' | 'secondary';

type Modal =
  | { type: 'registerVoter'; payload: Election }
  | { type: 'mnemonic'; payload: string[] }
  | { type: 'vote'; payload: { index: number; electionId: number; candidate: Candidate } };

type Modify<T, R> = Omit<T, keyof R> & R;
