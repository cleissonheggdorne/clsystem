export interface User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    userTypeId: number;
    userType: { id: number; description: string };
}