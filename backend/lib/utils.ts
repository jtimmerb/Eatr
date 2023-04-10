/** Reads the deployment type from environment */
export const getDeploymentEnv = (): string => {
  return process.env.DEPLOYMENT || 'dev';
};

/**
 * Creates an environment-specific name by appending the deployment
 * as a prefix.
 */
export const envSpecificName = (logicalName: string): string => {
  return `${getDeploymentEnv()}-${logicalName}`;
};
