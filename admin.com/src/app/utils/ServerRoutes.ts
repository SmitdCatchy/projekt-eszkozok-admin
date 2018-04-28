export class Routes {
    static LOGIN: String = 'login';
    static LOGOUT: String = 'logout';
    static USERS: String = 'users';
    static USER: String = 'user';
    static BAN: String = 'ban';
    static WARN: String = 'warn';
    static EDIT: String = 'edit';
  }
  
  export class Server {
    private static address: String = 'localhost';
    private static port: String = '3000';
    private static prefix: String = 'api';
  
    static routeTo(route: String) {
      return `http://${Server.address}:${Server.port}/${Server.prefix}/${route}`
    }
  }