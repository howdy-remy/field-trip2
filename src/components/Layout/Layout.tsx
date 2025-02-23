import { type ReactNode, useState } from "react";
import "./Layout.css";
import { useAuth } from "../../contexts/Authentication";
import { useGetProfileQuery } from "../../api/profile";
import Avatar from "../Avatar/Avatar";
import { Link } from "react-router";
import { HeadingOne } from "../Typography/typography";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const { data: profile } = useGetProfileQuery({ userId: session?.user.id });

  return (
    <div className="wrapper">
      <div className="sidebar">
        <Link to="/">
          <HeadingOne as="h1" style={{ margin: 0 }}>
            Field Trip
          </HeadingOne>
        </Link>
        <p>
          <Link to="/account">{profile?.username}</Link>
        </p>
        <Avatar url={profile?.avatar_url || null} size={40} />
      </div>
      {children}
    </div>
  );
};
