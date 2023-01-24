export interface Role {
  _id: string;
  name: string;
}
export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  roles?: Role[];
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phoneNumber?: number;
  isDeactivated?: boolean;
  ethnic?: string;
  religion?: string;
  CCCD?: number;
  notificationCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
