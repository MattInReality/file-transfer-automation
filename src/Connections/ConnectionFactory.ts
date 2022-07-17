import { Connection, ConnectionOptions } from "./Connection";
import { SftpConnection } from "./SftpConnection";
import { FtpConnection } from "./FtpConnection";
import { LocalFsConnection } from "./LocalFsConnection";

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
    } else throw new Error("connectionType not recognised");
  };
}
