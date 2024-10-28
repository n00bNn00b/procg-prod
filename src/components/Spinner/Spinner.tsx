import { tailspin } from "ldrs";
tailspin.register();

interface SpinnerProps {
  size: string;
  color: string;
}

const Spinner = ({ size, color }: SpinnerProps) => {
  return (
    <l-tailspin size={size} stroke="5" speed="2" color={color}></l-tailspin>
  );
};

export default Spinner;
