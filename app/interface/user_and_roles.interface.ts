export interface Role {
  _id: string;
  name: string;
}
export interface User {
  _id?: string;
  username?: string;
  email?: string;
  password?: string;
  roles?: Role[];
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phoneNumber?: string;
  isDeactivated?: boolean;
  ethnic?: string;
  religion?: string;
  CCCD?: string;
  notificationCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
