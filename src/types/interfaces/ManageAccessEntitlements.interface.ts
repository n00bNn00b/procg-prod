export interface IManageAccessEntitlementsTypes {
  entitlement_id: number;
  entitlement_name: string;
  description: string;
  comments: string;
  status: string;
  effective_date: string;
  revison: number;
  revision_date: string;
  created_on: string;
  last_updated_on: string;
  last_updated_by: string;
  created_by: string;
}
export interface IFetchAccessPointsElementTypes {
  id: number;
  entitlement_id: number;
  element_name: string;
  description: string;
  datasource: string;
  platform: string;
  element_type: string;
  access_control: string;
  change_control: string;
  audit: string;
}
export interface ICreateAccessPointsElementTypes {
  entitlement_id: number;
  element_name: string;
  description: string;
  datasource: string;
  platform: string;
  element_type: string;
  access_control: string;
  change_control: string;
  audit: string;
}
