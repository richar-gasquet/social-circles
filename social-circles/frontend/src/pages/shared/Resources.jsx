import GuestHeader from "../headers/GuestHeader";
import UserHeader from "../headers/UserHeader";
import { useAuthContext } from "../auth/AuthHandler";

function Resources() {
  const { isAuth } = useAuthContext();

  let header = <GuestHeader />

  if (isAuth) {
    header = <UserHeader />
  }

  return (
    <>
      {header}
    </>
  );
}

export default Resources;
