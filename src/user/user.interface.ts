export interface User{
    mobile:string;
    countryCode:string;
    name:string;
    email:string;
    password:string;
    createdAt:Date;
    updatedAt:Date;
    isDeleted:boolean;
    deletedAt:Date;
}