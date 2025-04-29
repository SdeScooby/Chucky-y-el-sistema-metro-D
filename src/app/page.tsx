"use client";

import { getMetroMedellinAlerts, Disruption } from "@/services/metro-medellin";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const LineNotificationPreferences = () => {
  const [metroA, setMetroA] = useState(true);
  const [metroB, setMetroB] = useState(true);
  const [tranvia, setTranvia] = useState(true);
  const [metroCable, setMetroCable] = useState(true);
  const [busesIntegrados, setBusesIntegrados] = useState(true);

  // Implement local storage or account sync for persisting preferences
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="metro-a">Metro A</Label>
        <Switch id="metro-a" checked={metroA} onCheckedChange={setMetroA} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="metro-b">Metro B</Label>
        <Switch id="metro-b" checked={metroB} onCheckedChange={setMetroB} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="tranvia">Tranvía</Label>
        <Switch id="tranvia" checked={tranvia} onCheckedChange={setTranvia} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="metro-cable">Metro Cable</Label>
        <Switch
          id="metro-cable"
          checked={metroCable}
          onCheckedChange={setMetroCable}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="buses-integrados">Buses Integrados</Label>
        <Switch
          id="buses-integrados"
          checked={busesIntegrados}
          onCheckedChange={setBusesIntegrados}
        />
      </div>
    </div>
  );
};

const RealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<Disruption[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const metroAlerts = await getMetroMedellinAlerts();
        setAlerts(metroAlerts);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
        // Display a default error message or fallback alerts
        setAlerts([
          {
            type: "Error",
            estimatedDuration: 0,
            alternatives: ["Check the Metro de Medellin official channels."],
            affectedLines: ["All"],
          },
        ]);
      }
    };

    fetchAlerts();

    // Setup interval for real-time updates (e.g., every 60 seconds)
    const intervalId = setInterval(fetchAlerts, 60000);
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  return (
    <div className="space-y-4">
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <Alert key={index} variant={alert.type === "Error" ? "destructive" : "default"}>
            <Info className="h-4 w-4" />
            <AlertTitle>{alert.type} on {alert.affectedLines.join(', ')}</AlertTitle>
            <AlertDescription>
              Estimated duration: {alert.estimatedDuration} minutes.{" "}
              Alternatives: {alert.alternatives.join(", ")}
            </AlertDescription>
          </Alert>
        ))
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No alerts at this time.</AlertTitle>
          <AlertDescription>
            The Metro de Medellin is operating normally.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const OfflineAlert = () => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Offline Mode</AlertTitle>
      <AlertDescription>
        Currently displaying the last available information. This may be
        outdated. Please check your internet connection for real-time updates.
      </AlertDescription>
    </Alert>
  );
};

export default function Home() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {isOnline ? (
            <RealTimeAlerts />
          ) : (
            <>
              <OfflineAlert />
              <RealTimeAlerts /> {/* Display last available info */}
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <LineNotificationPreferences />
        </CardContent>
      </Card>
    </div>
  );
}

