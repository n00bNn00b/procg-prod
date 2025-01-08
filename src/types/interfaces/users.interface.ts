export interface Token {
  isLoggedIn: boolean;
  access_token: string;
  tenant_id: number;
  user_id: number;
  user_type: string;
  user_name: string;
  iat: number;
  exp: number;
  issuedAt: string;
}
// export interface Token {
//   access_token?: string;
//   tenant_id?: number;
//   user_id?: number;
//   user_type?: string;
//   user_name: string;
// }

export interface Users {
  user_id: number;
  user_name: string;
  user_type?: string;
  email_addresses: string;
  created_by?: number;
  created_on?: string;
  last_updated_by?: number;
  last_updated_on?: string;
  tenant_id?: number;
  profile_picture?: string;
}
export interface IUpdateUserTypes {
  user_name: string;
  email_addresses: string[];
  first_name: string;
  middle_name: string | undefined;
  last_name: string;
  job_title: string;
  password?: string;
}
export interface ICombinedUser extends Users {
  person: IPersonsTypes;
}

export interface Message {
  id: string;
  sender: string;
  recivers: string[];
  subject: string;
  body: string;
  date: Date;
  status: string;
  parentid: string;
  involvedusers: string[];
  readers?: string[];
  holders?: string[];
  recyclebin?: string[];
}
export interface IAddUserTypes {
  user_type: string;
  user_name: string;
  email_addresses: string[];
  created_by: number | undefined;
  last_updated_by: number | undefined;
  tenant_id: number;
  first_name: string;
  middle_name: string | undefined;
  last_name: string;
  job_title: string;
  password: string;
}
export interface ITenantsTypes {
  tenant_id: number;
  tenant_name: string;
}
export interface IPersonsTypes {
  user_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  job_title: string;
}
export interface IUsersInfoTypes extends Users, IPersonsTypes {}

export interface IUserPasswordResetTypes {
  user_id: number;
  old_password: string;
  new_password: string;
}

export interface IUserLinkedDevices {
  id: number;
  user_id?: number;
  os: string;
  browser_name: string;
  device_type: string;
  browser_version: string;
  user_agent: string;
  is_active?: number;
  added_at?: string;
  user?: string;
  ip_address?: string;
  location?: string;
}
