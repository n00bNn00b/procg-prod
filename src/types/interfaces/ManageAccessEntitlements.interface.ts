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
  id?: number;
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
export interface IManageLocalConditonsType {
  id: string;
  instance: string;
  action: string;
  access_point_type: string;
  access_point: string;
  from_access_point_type: string;
  from_access_point: string;
  status: "Active" | "Inactive";
  comments: string;
}
export interface IManageGlobalConditionTypes {
  manage_global_condition_id: number;
  name: string;
  datasource: string;
  description: string;
  status: string;
}
export interface IManageGlobalConditionLogicTypes {
  manage_global_condition_logic_id: number;
  manage_global_condition_id: number;
  object: string;
  attribute: string;
  condition: string;
  value: string;
}
export interface IManageGlobalConditionLogicAttributesTypes {
  id: number;
  manage_global_condition_logic_id: number;
  widget_position: number;
  widget_state: number;
}
export interface IManageGlobalConditionLogicExtendTypes
  extends IManageGlobalConditionLogicTypes {
  id: number;
  manage_global_condition_logic_id: number;
  widget_position: number;
  widget_state: number;
}
export interface IManageAccessModelsTypes {
  manage_access_model_id: number;
  model_name: string;
  description: string;
  type: string;
  run_status: string;
  state: string;
  last_run_date: string;
  created_by: string;
  last_updated_by: string;
  last_updated_date: string;
  revision: number;
  revision_date: string;
}
