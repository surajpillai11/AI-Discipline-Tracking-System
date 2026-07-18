const Avatar = ({ name, avatarUrl, size = 64 }) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-accent-blue via-accent-violet to-accent-emerald font-display font-bold text-white"
    >
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

export default Avatar;
