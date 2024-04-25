import { useAuthContext } from "../../contexts/AuthContextHandler";
import GuestHeader from "../../components/headers/GuestHeader";
import UserHeader from "../../components/headers/UserHeader";
import AdminHeader from "../../components/headers/AdminHeader";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";

function Resources() {
  const { isAuth, isAdmin } = useAuthContext();

  return (
    <>
      <SessionTimeoutHandler/>
      {isAdmin ? <AdminHeader /> : isAuth ? <UserHeader /> : <GuestHeader />}
    </>
  );
}

export default Resources;
