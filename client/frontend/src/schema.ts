export type AuthUser = {
    username: string,
    emailAddress : string,
}

export type User = {
    id?: number;
    name: string;
    active: boolean;
    companies?: string;
};
  
export interface BaseProps {
    setNotification: (notification: string) => void; 
}