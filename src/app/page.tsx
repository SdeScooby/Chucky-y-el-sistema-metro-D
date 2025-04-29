"use client";

import { getMetroMedellinAlerts, Disruption } from "@/services/metro-medellin";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, Bus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search } from 'lucide-react';

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

interface BusRoute {
  id: string;
  name: string;
}

const MockBusRouteData: BusRoute[] = [
  { id: "C3-001", name: "C3-001 Santa Gema ⇄ Aguacatala" },
  { id: "C3-001A", name: "C3-001A Las Cabras ⇄ Aguacatala" },
  { id: "C3-002", name: "C3-002 Aguacatala ⇄ Bolivariana" },
  { id: "C3-003M", name: "C3-003M Balcón ⇄ Manzanillo" },
];

const DynamicRoutePreferences = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>(MockBusRouteData.map(route => route.id)); // Store selected route IDs, defaulting to all selected
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>(MockBusRouteData);

  const mapRef = useRef<Leaflet.Map | null>(null); // Use useRef to store the map instance

  useEffect(() => {
    const initializeMap = () => {
      const newMap = Leaflet.map('map').setView([6.2442, -75.5812], 13); // Medellín coordinates

      Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(newMap);

      // Add a marker (example)
      Leaflet.marker([6.2442, -75.5812]).addTo(newMap)
        .bindPopup('Medellín')
        .openPopup();

      mapRef.current = newMap;
    };

    if (!mapRef.current) {
      initializeMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const filteredRoutes = busRoutes.filter((route) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRouteSelection = (routeId: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Map */}
      <div id="map" className="h-64 rounded-md shadow-md z-0"></div>
      <div className="flex items-center space-x-2 mt-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Alimentador"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>
      <div className="overflow-y-auto mt-2 h-full">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary/10 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Bus className="h-5 w-5" />
              <div>{route.name}</div>
            </div>
            <Switch
              id={`route-${route.id}`}
              checked={selectedRoutes.includes(route.id)}
              onCheckedChange={() => toggleRouteSelection(route.id)}
            />
          </div>
        ))}
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
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <DynamicRoutePreferences />
        </CardContent>
      </Card>
    </div>
  );
}
