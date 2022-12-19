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
  draw?: boolean;
  winner?: boolean;
  voteCount?: number;
}

interface ElectionCreate {
  name: string;
  description: string;
  image: string;
  candidates: Candidate[];
  eligibleVoters: string[];
  expires: number;
}

interface ElectionRegister {
  ssn: string;
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

interface AdminElection extends Election {
  adminId: number;
  totalEligibleVoters: number;
  totalRegisteredVoters: number;
}

interface AdminUser {
  id: number;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  postalCode: number;
}

interface APIError {
  error: string;
  message: string;
  statusCode: number;
}
