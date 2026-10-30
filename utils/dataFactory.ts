export interface UserData {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

/** Builds a unique user so tests never collide when running in parallel. */
export function buildUser(overrides: Partial<UserData> = {}): UserData {
  const id = `${Date.now()}${Math.floor(Math.random() * 10_000)}`;
  return {
    name: `qa_user_${id}`,
    email: `qa_${id}@example.com`,
    password: 'Pass@12345',
    title: 'Mr',
    birthDay: '15',
    birthMonth: 'June',
    birthYear: '1990',
    firstName: 'Quincy',
    lastName: `Tester${id.slice(-4)}`,
    company: 'Perficient QA',
    address1: '555 Maryville University Dr',
    address2: 'Suite 500',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    zipcode: '500081',
    mobile: '9876543210',
    ...overrides,
  };
}
