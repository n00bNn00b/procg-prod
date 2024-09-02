export interface Token {
  access_token?: string;
  tenant_id?: number;
  user_id?: number;
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

export interface Message {
  id: string;
  sender: string;
  recivers: string[];
  subject: string;
  body: string;
  date: Date;
  status: string;
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
