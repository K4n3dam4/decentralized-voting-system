const configuration = {
  electionImageFallback:
    'https://img.freepik.com/free-vector/data-network-businessman_24908-57856.jpg?w=996&t=st=1670630635~exp=1670631235~hmac=013a8ead93aa571b59ef638e14c0fc3696a93302e5bcb6f9a99b41bab6855b0b',
  imageFallback: 'https://avatars.dicebear.com/api/male/username.svg',
};

const config = {
  get: (key: keyof typeof configuration) => configuration[key],
};

export { config };
