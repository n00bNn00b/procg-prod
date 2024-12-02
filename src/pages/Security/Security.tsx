import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChangePassword from "./ChangePassword";
import LinkDevies from "./LinkDevies";

export default function Security() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          {/* Change your password here. After saving, you'll be logged out. */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-center">
          <ChangePassword />
          <LinkDevies />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
