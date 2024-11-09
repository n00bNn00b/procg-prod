export interface Token {
  access_token?: string;
  tenant_id?: number;
  user_id?: number;
  user_type?: string;
  user_name: string;
}

export interface Users {
  user_id: number;
  user_name: string;
  user_type?: string;
  email_addresses?: string;
  created_by?: number;
  created_on?: string;
  last_updated_by?: number;
  last_updated_on?: string;
  tenant_id?: number;
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
