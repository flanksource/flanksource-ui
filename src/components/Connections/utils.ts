/**
 * Formats a connection URL in the format:
 * - connection://<namespace>/<name> when namespace is provided
 * - connection://<name> when namespace is null/empty
 */
export function getConnectionURL(connection: {
  namespace?: string | null;
  name: string;
}): string {
  if (connection.namespace) {
    return `connection://${connection.namespace}/${connection.name}`;
  }
  return `connection://${connection.name}`;
}
