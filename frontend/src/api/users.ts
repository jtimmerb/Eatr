export interface User {
  userId: number;
  name: string;
}

// create user interface
export interface CreateUserRequest {
  name: string;
}

export interface CreateUserResponse extends User {}

export interface GetUserResponse extends User {}

export type ListUsersResponse = User[];
