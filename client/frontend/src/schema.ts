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

export type Company = {
    id: number;
    name: string;
    active: boolean;
};

export type Permission = {
    id: number;
    name: string;
    active: boolean;
};  

export type Role = {
    id: number;
    name: string;
    active: boolean;
  };
    
export interface BaseProps {
    setNotification: (notification: string) => void; 
}