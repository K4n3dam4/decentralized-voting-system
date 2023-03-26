/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

interface ValidateParam {
  field: string;
  value: any;
  validationType: validationType[];
}
type validationType =
  | 'notEmpty'
  | 'notEmptyObjArray'
  | 'notEmptyArray'
  | 'string'
  | 'email'
  | 'password'
  | 'passwordRepeat'
  | 'mnemonic';
interface validationFactoryParams {
  fields: Record<string, any>;
  validationTypes: { field: string; validationType: validationType[] }[];
}
type buttonType = 'primary' | 'secondary';

type Modal =
  | { type: 'loading'; payload: string }
  | { type: 'registerVoter'; payload: Election }
  | { type: 'mnemonic'; payload: string[] }
  | { type: 'vote'; payload: { index: number; electionId: number; candidate: Candidate } }
  | { type: 'closeElection'; payload: Partial<Election> };

type Modify<T, R> = Omit<T, keyof R> & R;
