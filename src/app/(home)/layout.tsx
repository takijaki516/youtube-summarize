interface IHomeLayoutProps {
  children: React.ReactNode;
  summaries: React.ReactNode;
}

const HomeLayout = ({ children, summaries }: IHomeLayoutProps) => {
  return (
    <div>
      {children}
      {summaries}
    </div>
  );
};

export default HomeLayout;
