export interface User {
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  sub: string;
  picture?: string;
  org_id: string;
  org_name: string;
}
