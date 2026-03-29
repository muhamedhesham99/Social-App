const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-secondary">
      <div className="relative flex items-center justify-center">
        {/* center dot */}
        <div className="w-4 h-4 bg-primary rounded-full z-10"></div>

        {/* rings */}
        <div className="absolute w-20 h-20 border-2 border-accent2 rounded-full animate-ping"></div>
        <div className="absolute w-20 h-20 border-2 border-primary rounded-full animate-ping delay-300"></div>
        <div className="absolute w-20 h-20 border-2 border-accent2 rounded-full animate-ping delay-700"></div>
      </div>
    </div>
  );
};

export default Loading;
