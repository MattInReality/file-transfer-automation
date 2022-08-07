import { Connection, ConnectionOptions } from "./Connection.js";
import { SftpConnection } from "./SftpConnection.js";
import { FtpConnection } from "./FtpConnection.js";
import { LocalFsConnection } from "./LocalFsConnection.js";
import { HTTPConnection } from "./HTTPConnection.js";

export interface ConnectionFactoryOptions {
  connectionType: string;
  connectionOptions: ConnectionOptions;
}

export class ConnectionFactory {
  static create = (
    connectionFactoryOptions: ConnectionFactoryOptions
  ): Connection => {
    if (connectionFactoryOptions.connectionType === "SFTP") {
      return new SftpConnection(connectionFactoryOptions.connectionOptions);
    } else if (connectionFactoryOptions.connectionType === "FTP") {
      return new FtpConnection(connectionFactoryOptions.connectionOptions);
    } else if (connectionFactoryOptions.connectionType === "LOCAL") {
      return new LocalFsConnection();
    } else if (connectionFactoryOptions.connectionType === "HTTP") {
      return new HTTPConnection(connectionFactoryOptions.connectionOptions);
    } else throw new Error("connectionType not recognised");
  };
}
