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

interface ElectionRegister {
  ssn: string;
}

interface Registered {
  mnemonic: string;
  election: Election;
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

interface Candidate {
  name: string;
  image?: string;
  party?: string;
}

interface Election {
  id: number;
  name: string;
  image?: string;
  description: string;
  candidates: Candidate[];
  expires: string;
  createdAt: string;
  updatedAt: string;
  registered?: boolean;
  hasVoted?: boolean;
}

interface APIError {
  error: string;
  message: string;
  statusCode: number;
}
