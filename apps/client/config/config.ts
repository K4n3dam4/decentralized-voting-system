const configuration = {
  electionImageFallback:
    'https://img.freepik.com/free-vector/wallpaper-2020-us-presidential-election_52683-48919.jpg?w=1800&t=st=1668600330~exp=1668600930~hmac=23b84d7309640eb9d6d5e261a6bda7c5e478728d8db0b94957f9a3860c79bd2f',
  imageFallback: 'https://avatars.dicebear.com/api/male/username.svg',
};

const config = {
  get: (key: keyof typeof configuration) => configuration[key],
};

export { config };
