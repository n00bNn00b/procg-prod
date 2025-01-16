import { useEffect, useState } from "react";

const TestTable = () => {
  const [res, setRes] = useState<any[]>([]);

  useEffect(() => {
    const newAccessPoints = [];

    for (let index = 0; index <= 150; index++) {
      newAccessPoints.push({
        access_point_id: index,
        data_source_id: 1,
        element_name: `AZN_EXPENSE_CYCLE ${index}`,
        description: `AZN_EXPENSE_CYCLE ${index}`,
        platform: "R12",
        element_type: "Menu",
        access_control: "true",
        change_control: "",
        audit: "",
        created_by: "admin",
        last_updated_by: "admin",
      });
    }

    setRes(newAccessPoints ?? []);
  }, []); // Empty dependency array to run only once on mount

  console.log(res, "res");

  return <div>testtable</div>;
};

export default TestTable;
