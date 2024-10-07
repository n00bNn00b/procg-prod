import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] bg-secondary">
      <h4 className="font-bold text-8xl">404</h4>
      <h4 className="text-2xl">Page Not Found</h4>
      <Link to="/" className="text-blue-600 mt-8">
        Go back to Home Page
      </Link>
    </div>
  );
};
export default Error;
