/**
 * Represents a disruption in the Metro de Medellin transportation network.
 */
export interface Disruption {
  /**
   * The type of disruption (e.g., delay, closure).
   */
  type: string;
  /**
   * The estimated duration of the disruption in minutes.
   */
  estimatedDuration: number;
  /**
   * Suggested alternatives for users affected by the disruption.
   */
  alternatives: string[];
  /**
   * Affected lines (e.g., Metro A, Tranvia).
   */
  affectedLines: string[];
}

/**
 * Asynchronously retrieves real-time alerts and status updates for the Metro de Medellin.
 *
 * @returns A promise that resolves to an array of Disruption objects.
 */
export async function getMetroMedellinAlerts(): Promise<Disruption[]> {
  // Simulate API call to Metro de Medellin
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate some random alerts
      const random = Math.random();
      let alerts: Disruption[] = [];

      if (random > 0.7) {
        alerts.push({
          type: 'Delay',
          estimatedDuration: 5,
          alternatives: ['Take a bus'],
          affectedLines: ['Metro A'],
        });
      }

      if (random > 0.9) {
        alerts.push({
          type: 'Closure',
          estimatedDuration: 60,
          alternatives: ['Use integrated bus route'],
          affectedLines: ['Metro B'],
        });
      }

      resolve(alerts);
    }, 500); // Simulate network latency
  });
}
