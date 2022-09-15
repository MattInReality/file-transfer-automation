import { Connection, ConnectionOptions } from "./Connection";
import { SftpConnection } from "./SftpConnection";
import { FtpConnection } from "./FtpConnection";
import { LocalFsConnection } from "./LocalFsConnection";
import { HTTPConnection } from "./HTTPConnection";

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
