// Fallback shim: если IDE не подтянет @types/bcryptjs сразу.
declare module "bcryptjs" {
  import bcrypt = require("bcryptjs");
  export = bcrypt;
}
