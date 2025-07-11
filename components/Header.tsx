import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center pt-8 pb-12">
      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
        GitHub Repo Describer
      </h1>
      <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
        Automatically discover repositories without descriptions and generate them with AI.
      </p>
    </header>
  );
};

export default Header;