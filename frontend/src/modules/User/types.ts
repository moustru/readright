export type UserAuthRequest = {
  name: string;
  password: string;
};

export type AuthResponse = {
  data: {
    accessToken: string;
  };
};
