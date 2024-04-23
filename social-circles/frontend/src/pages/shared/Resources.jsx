import { useAuthContext } from "../../contexts/AuthContextHandler";
import GuestHeader from "../../components/headers/GuestHeader";
import UserHeader from "../../components/headers/UserHeader";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";

function Resources() {
  const { isAuth } = useAuthContext();

  return (
    <>
      {isAuth ? (
        <SessionTimeoutHandler />,
        <UserHeader />
      ) : (
        <SessionTimeoutHandler />,
        <GuestHeader />
      )}
    </>
  );
}

export default Resources;
