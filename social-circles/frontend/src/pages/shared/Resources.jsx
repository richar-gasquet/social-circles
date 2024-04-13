import { useAuthContext } from "../../contexts/AuthContextHandler";
import GuestHeader from "../../components/headers/GuestHeader";
import UserHeader from "../../components/headers/UserHeader";

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
