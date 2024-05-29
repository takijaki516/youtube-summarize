interface IHomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  return <div>{children}</div>;
};

export default HomeLayout;
