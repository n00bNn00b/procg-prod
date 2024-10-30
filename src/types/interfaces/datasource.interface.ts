export interface IDataSourceTypes {
  data_source_id: number;
  datasource_name: string;
  description: string;
  application_type: string;
  application_type_version: string;
  last_access_synchronization_date: string;
  last_access_synchronization_status: string;
  last_transaction_synchronization_date: string;
  last_transaction_synchronization_status: string;
  default_datasource: string;
}
export interface IManageAccessEntitlementsPerPageTypes {
  results: IDataSourceTypes[];
  totalPages: number;
  currentPage: number;
}
export interface IDataSourcePostTypes {
  data_source_id?: number;
  datasource_name: string;
  description: string;
  application_type: string;
  application_type_version: string;
  last_access_synchronization_status: string;
  last_transaction_synchronization_status: string;
  default_datasource: string;
  created_by: string;
  created_on?: Date;
  last_updated_by: string;
  last_updated_on?: Date;
}
