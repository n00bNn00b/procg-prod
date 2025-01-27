export interface IARMAsynchronousTasksTypes {
  arm_task_id: number;
  script_name: string;
  task_name: string;
  user_task_name: string;
  description: string;
  execution_method: string;
  cancelled_yn: string;
  created_by?: number;
  creation_date: string;
  last_update_date: string;
  last_updated_by?: number;
}
export interface IARMTaskParametersTypes {
  arm_param_id: number;
  created_by: number;
  creation_date: string;
  data_type: string;
  description: string;
  last_update_date: string;
  last_updated_by: number;
  parameter_name: string;
  task_name: string;
}
