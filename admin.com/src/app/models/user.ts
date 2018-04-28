export class User {
    _id: String;
    name: String;
    email: String;
    password: String;
    role: String;
    flagged: boolean;
    flags: any;
    warn: String;
    ban: Date;

    constructor(_id: String, name: String, email: String, password: String, role: String,
        flags: any[],
        warn: String,
        ban: Date) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.flagged = true;
        this.flags = flags;
        this.warn = warn;
        this.ban = ban;
    }
}