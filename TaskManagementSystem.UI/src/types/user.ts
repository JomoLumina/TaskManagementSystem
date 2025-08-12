import { Role } from "./role";

export type User = {
    id: string;
    username: string;
    email: string;
    password?: string;
    role: Role;
    createdAt: Date;
}