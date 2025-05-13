export const IS_DEV = import.meta.env.MODE === 'development';

export const DEV_USER = {
  userId: 1,
  username: 'akentech',
  email: 'dev@akentech.com',
  role: 'ADMIN',
  name: 'Developer',
  enabled: true,
  createdAt: new Date().toISOString(), // Add any missing required fields
  updatedAt: new Date().toISOString()  // Add any missing required fields
};