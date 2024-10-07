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
            src="https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
