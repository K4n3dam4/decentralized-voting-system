/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

// Api
interface VoterSignup {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  ssn: string;
  email: string;
  password: string;
}

interface VoterSignin {}

type buttonType = 'primary' | 'secondary';
