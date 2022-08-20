import { Connection, ConnectionOptions } from "./Connection.js";
import { SftpConnection } from "./SftpConnection.js";
import { FtpConnection } from "./FtpConnection.js";
import { LocalFsConnection } from "./LocalFsConnection.js";
import { HTTPConnection } from "./HTTPConnection.js";

export class ConnectionFactory {
  static create = (connectionOptions: ConnectionOptions): Connection => {
    if (connectionOptions.connectionType === "SFTP") {
      return new SftpConnection(connectionOptions);
    } else if (connectionOptions.connectionType === "FTP") {
      return new FtpConnection(connectionOptions);
    } else if (connectionOptions.connectionType === "LOCAL") {
      return new LocalFsConnection(connectionOptions);
    } else if (connectionOptions.connectionType === "HTTP") {
      return new HTTPConnection(connectionOptions);
    } else throw new Error("connectionType not recognised");
  };
}
