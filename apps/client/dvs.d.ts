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

type Role = { role: 'VOTER' } | { serviceNumber: number; role: 'ADMIN' };

type User = {
  email: string;
  id: number;
  iat: number;
  exp: number;
} & Role;

interface Access {
  access_token: string;
}
