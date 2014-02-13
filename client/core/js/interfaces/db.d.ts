interface IClassSchema {
}

interface IUserSchema {
    __v: string;
    _id: string;
    classes: IClassSchema[];
    username: string;
}