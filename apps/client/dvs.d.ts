interface VoterSignup {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: number;
  city: string;
  ssn: string;
  email: string;
  password: string;
}

interface VoterSignin {
  email: string;
  password: string;
}

interface Voter {
  email: string;
  id: number;
  iat: number;
  exp: number;
}

interface Admin {
  serviceNumber: string;
  id: number;
  iat: number;
  exp: number;
}

interface Access {
  access_token: string;
}
