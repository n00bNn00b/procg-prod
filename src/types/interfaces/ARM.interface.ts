export interface IExecutionMethodsTypes {
  description: string;
  execution_method: string;
  executor: string;
  internal_execution_method: string;
}
export interface IARMAsynchronousTasksTypes {
  arm_task_id: number;
  script_name: string;
  script_path?: string;
  task_name: string;
  user_task_name: string;
  description: string;
  execution_method: string;
  executor?: string;
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
export interface IAsynchronousRequestsAndTaskSchedulesTypes {
  args: string[];
  arm_task_sche_id: number;
  cancelled_yn: string;
  created_by: number;
  creation_date: string;
  kwargs: {
    employee_id: number;
  };
  last_update_date: string;
  last_updated_by: number;
  redbeat_schedule_name: string;
  schedule: number;
  task_name: string;
  user_schedule_name: string;
  parameters: string;
  schedule_type: string;
  ready_for_redbeat: string;
}

export interface ISchedulePropsPeriodic {
  FREQUENCY: number;
  FREQUENCY_TYPE: string;
}
export interface ISchedulePropsNonPeriodic {
  VALUES: string[];
}
export interface IScheduleOnce {
  VALUES: string;
}

export interface IAsynchronousRequestsAndTaskSchedulesTypesV1 {
  args: string[];
  arm_task_sche_id: number;
  cancelled_yn: string;
  created_by: number;
  creation_date: string;
  kwargs: {
    employee_id: number;
  };
  last_update_date: string;
  last_updated_by: number;
  parameters: string;
  redbeat_schedule_name: string;
  ready_for_redbeat: string;
  schedule: ISchedulePropsPeriodic | ISchedulePropsNonPeriodic | IScheduleOnce;
  schedule_type: string;
  task_name: string;
  user_schedule_name: string;
  user_task_name: string;
}
export interface IARMAsynchronousTasksParametersTypes {
  user_task_name: string;
  parameter_name: string;
  data_type: string;
}
export interface IARMViewRequestsTypes {
  request_id: number;
  task_id: string;
  status: string;
  user_task_name: string;
  task_name: string;
  executor: string;
  user_schedule_name: string;
  redbeat_schedule_name: string;
  schedule: number;
  args: string;
  kwargs: string;
  parameters: string;
  result: string;
  timestamp: string;
}
