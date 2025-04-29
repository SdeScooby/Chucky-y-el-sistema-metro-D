"use client";

import { getMetroMedellinAlerts, Disruption } from "@/services/metro-medellin";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, Bus, Train, CableCar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from 'next-themes';
import { Moon, Sun, HelpCircle, ArrowLeft } from 'lucide-react';

interface LinePreferenceProps {
  lineName: string;
  lineColor: string;
  defaultState: boolean;
  onToggle: (newState: boolean) => void;
}

const LinePreference: React.FC<LinePreferenceProps> = ({
  lineName,
  lineColor,
  defaultState,
  onToggle,
}) => {
  const [isEnabled, setIsEnabled] = useState(defaultState);

  const toggleSwitch = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onToggle(newState);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-3">
        <span
          className="inline-block h-6 w-6 rounded-full"
          style={{ backgroundColor: lineColor }}
        ></span>
        <span className="font-medium">{lineName}</span>
      </div>
      <Switch id={`line-${lineName}`} checked={isEnabled} onCheckedChange={toggleSwitch} />
    </div>
  );
};

const LineNotificationPreferences = () => {
  const [metroA, setMetroA] = useState(true);
  const [metroB, setMetroB] = useState(true);
  const [tranvia, setTranvia] = useState(true);
  const [metroCable, setMetroCable] = useState(true);
  const [busesIntegrados, setBusesIntegrados] = useState(true);

  return (
    <div className="space-y-3">
      <LinePreference
        lineName="Metro A"
        lineColor="#A4D16A"
        defaultState={metroA}
        onToggle={setMetroA}
      />
      <LinePreference
        lineName="Metro B"
        lineColor="#E57373"
        defaultState={metroB}
        onToggle={setMetroB}
      />
      <LinePreference
        lineName="Tranvía"
        lineColor="#F06292"
        defaultState={tranvia}
        onToggle={setTranvia}
      />
      <LinePreference
        lineName="Metro Cable"
        lineColor="#64B5F6"
        defaultState={metroCable}
        onToggle={setMetroCable}
      />
      <LinePreference
        lineName="Buses Integrados"
        lineColor="#FFB74D"
        defaultState={busesIntegrados}
        onToggle={setBusesIntegrados}
      />
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

const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
});

const RouteNotificationPreferences = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>(MockBusRouteData.map(route => route.id));
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>(MockBusRouteData);

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
      <ScrollArea className="overflow-y-auto mt-2 h-full">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary/10 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Bus className="h-5 w-5" />
              <div className="font-medium">{route.name}</div>
            </div>
            <Switch
              id={`route-${route.id}`}
              checked={selectedRoutes.includes(route.id)}
              onCheckedChange={() => toggleRouteSelection(route.id)}
            />
          </div>
        ))}
      </ScrollArea>
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

    const intervalId = setInterval(fetchAlerts, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-4">
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <Alert key={index} variant={alert.type === "Error" ? "destructive" : "default"}>
            <Info className="h-4 w-4" />
            <AlertTitle className="font-semibold">{alert.type} on {alert.affectedLines.join(', ')}</AlertTitle>
            <AlertDescription>
              Estimated duration: {alert.estimatedDuration} minutes.{" "}
              Alternatives: {alert.alternatives.join(", ")}
            </AlertDescription>
          </Alert>
        ))
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle className="font-semibold">No alerts at this time.</AlertTitle>
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
      <AlertTitle className="font-semibold">Offline Mode</AlertTitle>
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
  const [activeSection, setActiveSection] = useState<'alerts' | 'lines' | 'routes'>('alerts');
   const { theme, setTheme } = useTheme();

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
    <div className="flex h-screen bg-background font-sans antialiased">
      {/* Sidebar */}
      <div className="w-16 p-4 flex flex-col items-center space-y-4 bg-secondary rounded-xl shadow-md">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 rounded-xl">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Real-Time Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {isOnline ? (
              <RealTimeAlerts />
            ) : (
              <>
                <OfflineAlert />
                <RealTimeAlerts />
              </>
            )}
          </CardContent>
        </Card>
        <Card className="h-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <div className="flex space-x-4 justify-around">
              <Button
                variant="outline"
                className={`flex-1 ${activeSection === 'lines' ? 'bg-secondary/20' : ''}`}
                onClick={() => setActiveSection('lines')}
              >
                <Train className="mr-2" /> Lines
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${activeSection === 'routes' ? 'bg-secondary/20' : ''}`}
                onClick={() => setActiveSection('routes')}
              >
                <Bus className="mr-2" /> Routes
              </Button>
            </div>

            {activeSection === 'lines' && (
              <div className="p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Line Notifications</h3>
                <LineNotificationPreferences />
              </div>
            )}

            {activeSection === 'routes' && (
              <div className="flex flex-col h-[500px]">
                <h3 className="text-lg font-semibold mb-2">Route Notifications</h3>
                <div className="h-48 relative rounded-md overflow-hidden">
                  <DynamicMap />
                </div>
                <div className="flex-1 mt-2">
                  <RouteNotificationPreferences />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
