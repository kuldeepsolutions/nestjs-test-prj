export interface UserModel{
    mobile:string;
    countryCode:string;
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    createdAt:Date;
    updatedAt:Date;
    isDeleted:boolean;
    deletedAt:Date;
}