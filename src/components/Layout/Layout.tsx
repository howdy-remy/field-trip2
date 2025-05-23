import { type ReactNode } from "react";
import { Link } from "react-router";

import { useAuth } from "contexts/Authentication";
import { useGetProfileQuery } from "api/profile";
import { useGetPacksQuery } from "api/packs";

import { Avatar } from "components/Avatar";
import {
  LogoType,
  Wrapper,
  Sidebar,
  AccountInfo,
  Username,
  SidebarLink,
  SidebarLinks,
  SignInCta,
} from "./Layout.styled";
import { Button } from "components/Button";
import { TextSansBold, TextSansRegular } from "components/Typography";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const { data: profile } = useGetProfileQuery(
    { userId: session?.user.id },
    {
      skip: !session,
    },
  );
  const { data: packs } = useGetPacksQuery({}, { skip: !session });

  return (
    <Wrapper>
      <Sidebar>
        <Link to="/" style={{ textDecoration: "none" }}>
          <LogoType as="h1">
            base<span>weight</span>
          </LogoType>
        </Link>

        {session && (
          <>
            <SidebarLinks>
              <SidebarLink to="/">
                <TextSansBold>All Gear</TextSansBold>
              </SidebarLink>
              <SidebarLink to="/">
                <TextSansBold>Packs</TextSansBold>
              </SidebarLink>
              {packs?.map((pack) => (
                <SidebarLink to={`/packs/${pack.id}`} key={pack.id}>
                  {pack.name}
                </SidebarLink>
              ))}
            </SidebarLinks>

            <Link to="/account" style={{ textDecoration: "none" }}>
              <AccountInfo>
                <Username>{profile?.username}</Username>
                <Avatar
                  url={profile?.avatar_url || null}
                  size={40}
                  initial={profile?.username[0]}
                />
              </AccountInfo>
            </Link>
          </>
        )}
        {!session && (
          <SignInCta>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button variant="primary" size="large">
                Sign in
              </Button>
            </Link>
          </SignInCta>
        )}
      </Sidebar>
      {children}
    </Wrapper>
  );
};
