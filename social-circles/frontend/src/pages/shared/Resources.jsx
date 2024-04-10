import GuestHeader from "../headers/GuestHeader";
import UserHeader from "../headers/UserHeader";
import { useAuthContext } from "../auth/AuthHandler";

function Resources() {
  const { isAuth } = useAuthContext();

  return (
    <>
      {isAuth ? (
        <UserHeader />
      ) : (
        <GuestHeader />
      )}
    </>
  );
}

export default Resources;
