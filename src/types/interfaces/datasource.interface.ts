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
export interface IDataSourcePostTypes {
  data_source_id?: number;
  datasource_name: string;
  description: string;
  application_type: string;
  application_type_version: string;
  last_access_synchronization_status: string;
  last_transaction_synchronization_status: string;
  default_datasource: string;
}
