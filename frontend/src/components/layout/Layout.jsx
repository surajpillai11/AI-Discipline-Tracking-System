import Navbar from "./Navbar";

const Layout = ({ children }) => (
  <div className="min-h-screen px-4 py-6 sm:px-8">
    <Navbar />
    <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">{children}</div>
  </div>
);

export default Layout;
