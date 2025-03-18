import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useEffect, useState } from "react";

export type IProfilesType = {
  id: number;
  email_addresses: string[];
  phones: string[];
  guid: string;
  username: string;
};
// interface IAccessProfiles {
//   user_name?: string;
//   email?: string;
//   email_1?: string;
//   email_2?: string;
//   email_3?: string;
//   email_4?: string;
//   phone_1?: string;
//   phone_2?: string;
//   phone_3?: string;
// }

// const profiles = [
//   {
//     id: 1,
//     email_addresses: ["kallany_01@gmail.com", "kallany_02@gmaiI.com"],
//     phones: ["+8801234567890", "+8801234567890"],
//     guid: "5678299308765268",
//     username: "Kchakma",
//   },
// ];
// const d = [
//   {
//     id: 1,
//     email: "kallany_01@gmail.com",
//     primary: true,
//   },
//   {
//     id: 2,
//     email: "kallany_02@gmail.com",
//     primary: false,
//   },
//   {
//     id: 3,
//     username: "kchakma",
//     primary: false,
//   },
// ];
export interface IProfilesType1 {
  id: number;
  type: string;
  email?: string;
  phone?: string;
  username?: string;
  UserID?: string;
  primary: string;
}
const ProfileTable = () => {
  const { combinedUser } = useGlobalContext();
  const [data, setData] = useState<IProfilesType1[]>([]);

  useEffect(() => {
    try {
      if (combinedUser) {
        const accessProfiles: IProfilesType1[] = [];

        for (let i = 0; i < combinedUser?.email_addresses.length; i++) {
          const email = combinedUser?.email_addresses[i];

          const profile = {
            id: i + 1,
            type: "email",
            email: email,
            primary: "false",
          };

          accessProfiles.push(profile);
        }
        if (combinedUser.user_name) {
          const user_name = combinedUser?.user_name;

          const profile = {
            id: accessProfiles.length + 1,
            type: "username",
            username: user_name,
            primary: "false",
          };
          accessProfiles.push(profile);
        }
        if (combinedUser.user_id) {
          const user_id = combinedUser?.user_id.toString();

          const profile = {
            id: accessProfiles.length + 1,
            type: "UserID",
            username: user_id,
            primary: "false",
          };
          accessProfiles.push(profile);
        }

        setData(accessProfiles);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [combinedUser]);

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="bg-[#CEDEF2] text-slate-500 text-left font-medium">
            <th className="border px-4 py-2 font-semibold">SL</th>
            <th className="border px-4 py-2 font-semibold">Profile Type</th>
            <th className="border px-4 py-2 font-semibold">Profile ID</th>
            <th className="border px-4 py-2 font-semibold">Primary</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, i) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{i + 1}</td>
              <td className="border px-4 py-2 capitalize">{item.type}</td>
              <td className="border px-4 py-2">
                {item.email || item.username || item.phone}
              </td>
              <td className="border px-4 py-2 capitalize">{item.primary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileTable;
