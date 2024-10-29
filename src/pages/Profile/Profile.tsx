import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const Profile = () => {
  const { person } = useGlobalContext();

  return (
    <div className="flex w-[100%] h-60 items-center justify-center">
      <div>
        <Avatar>
          <AvatarImage
            className="object-cover object-center w-20 h-20 rounded-full mx-auto border border-8px"
            src="https://github.com/shadcn.png"
          />
        </Avatar>
        <h4 className="font-bold text-center">
          {person?.first_name} {person?.last_name}
        </h4>
        <h4>Job Title : {person?.job_title}</h4>
        {/* <h4 className="capitalize">User Type: {token.user_type}</h4>
        <h4 className="capitalize">Job Title: {person?.job_title}</h4> */}
      </div>
    </div>
  );
};

export default Profile;
