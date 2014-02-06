
/// <reference path='model.d.ts'/>

interface IAuth {
    isAuthenticated: boolean;
    user: IUser;
    prevLocation: string;
}