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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  { id: "C3-004", name: "C3-004 Circular বর্ষাকালে" },
  { id: "C3-005", name: "C3-005 Circular বর্ষাকালে" },
    { id: "C3-006", name: "C3-006 Circular বর্ষাকালে" },
    { id: "C3-007", name: "C3-007 Circular বর্ষাকালে" },
    { id: "C3-008", name: "C3-008 Circular বর্ষাকালে" },
    { id: "C3-009", name: "C3-009 Circular বর্ষাকালে" },
    { id: "C3-010", name: "C3-010 Circular বর্ষাকালে" },
    { id: "C3-011", name: "C3-011 Circular বর্ষাকালে" },
    { id: "C3-012", name: "C3-012 Circular বর্ষাকালে" },
    { id: "C3-013", name: "C3-013 Circular বর্ষাকালে" },
    { id: "C3-014", name: "C3-014 Circular বর্ষাকালে" },
    { id: "C3-015", name: "C3-015 Circular বর্ষাকালে" },
    { id: "C3-016", name: "C3-016 Circular বর্ষাকালে" },
    { id: "C3-017", name: "C3-017 Circular বর্ষাকালে" },
    { id: "C3-018", name: "C3-018 Circular বর্ষাকালে" },
    { id: "C3-019", name: "C3-019 Circular বর্ষাকালে" },
    { id: "C3-020", name: "C3-020 Circular বর্ষাকালে" },
    { id: "C3-021", name: "C3-021 Circular বর্ষাকালে" },
    { id: "C3-022", name: "C3-022 Circular বর্ষাকালে" },
    { id: "C3-023", name: "C3-023 Circular বর্ষাকালে" },
    { id: "C3-024", name: "C3-024 Circular বর্ষাকালে" },
    { id: "C3-025", name: "C3-025 Circular বর্ষাকালে" },
    { id: "C3-026", name: "C3-026 Circular বর্ষাকালে" },
    { id: "C3-027", name: "C3-027 Circular বর্ষাকালে" },
    { id: "C3-028", name: "C3-028 Circular বর্ষাকালে" },
    { id: "C3-029", name: "C3-029 Circular বর্ষাকালে" },
    { id: "C3-030", name: "C3-030 Circular বর্ষাকালে" },
    { id: "C3-031", name: "C3-031 Circular বর্ষাকালে" },
    { id: "C3-032", name: "C3-032 Circular বর্ষাকালে" },
    { id: "C3-033", name: "C3-033 Circular বর্ষাকালে" },
    { id: "C3-034", name: "C3-034 Circular বর্ষাকালে" },
    { id: "C3-035", name: "C3-035 Circular বর্ষাকালে" },
    { id: "C3-036", name: "C3-036 Circular বর্ষাকালে" },
    { id: "C3-037", name: "C3-037 Circular বর্ষাকালে" },
    { id: "C3-038", name: "C3-038 Circular বর্ষাকালে" },
    { id: "C3-039", name: "C3-039 Circular বর্ষাকালে" },
    { id: "C3-040", name: "C3-040 Circular বর্ষাকালে" },
    { id: "C3-041", name: "C3-041 Circular বর্ষাকালে" },
    { id: "C3-042", name: "C3-042 Circular বর্ষাকালে" },
    { id: "C3-043", name: "C3-043 Circular বর্ষাকালে" },
    { id: "C3-044", name: "C3-044 Circular বর্ষাকালে" },
    { id: "C3-045", name: "C3-045 Circular বর্ষাকালে" },
    { id: "C3-046", name: "C3-046 Circular বর্ষাকালে" },
    { id: "C3-047", name: "C3-047 Circular বর্ষাকালে" },
    { id: "C3-048", name: "C3-048 Circular বর্ষাকালে" },
    { id: "C3-049", name: "C3-049 Circular বর্ষাকালে" },
    { id: "C3-050", name: "C3-050 Circular বর্ষাকালে" },
    { id: "C3-051", name: "C3-051 Circular বর্ষাকালে" },
    { id: "C3-052", name: "C3-052 Circular বর্ষাকালে" },
    { id: "C3-053", name: "C3-053 Circular বর্ষাকালে" },
    { id: "C3-054", name: "C3-054 Circular বর্ষাকালে" },
    { id: "C3-055", name: "C3-055 Circular বর্ষাকালে" },
    { id: "C3-056", name: "C3-056 Circular বর্ষাকালে" },
    { id: "C3-057", name: "C3-057 Circular বর্ষাকালে" },
    { id: "C3-058", name: "C3-058 Circular বর্ষাকালে" },
    { id: "C3-059", name: "C3-059 Circular বর্ষাকালে" },
    { id: "C3-060", name: "C3-060 Circular বর্ষাকালে" },
    { id: "C3-061", name: "C3-061 Circular বর্ষাকালে" },
    { id: "C3-062", name: "C3-062 Circular বর্ষাকালে" },
    { id: "C3-063", name: "C3-063 Circular বর্ষাকালে" },
    { id: "C3-064", name: "C3-064 Circular বর্ষাকালে" },
    { id: "C3-065", name: "C3-065 Circular বর্ষাকালে" },
    { id: "C3-066", name: "C3-066 Circular বর্ষাকালে" },
    { id: "C3-067", name: "C3-067 Circular বর্ষাকালে" },
    { id: "C3-068", name: "C3-068 Circular বর্ষাকালে" },
    { id: "C3-069", name: "C3-069 Circular বর্ষাকালে" },
    { id: "C3-070", name: "C3-070 Circular বর্ষাকালে" },
    { id: "C3-071", name: "C3-071 Circular বর্ষাকালে" },
    { id: "C3-072", name: "C3-072 Circular বর্ষাকালে" },
    { id: "C3-073", name: "C3-073 Circular বর্ষাকালে" },
    { id: "C3-074", name: "C3-074 Circular বর্ষাকালে" },
    { id: "C3-075", name: "C3-075 Circular বর্ষাকালে" },
    { id: "C3-076", name: "C3-076 Circular বর্ষাকালে" },
    { id: "C3-077", name: "C3-077 Circular বর্ষাকালে" },
    { id: "C3-078", name: "C3-078 Circular বর্ষাকালে" },
    { id: "C3-079", name: "C3-079 Circular বর্ষাকালে" },
    { id: "C3-080", name: "C3-080 Circular বর্ষাকালে" },
    { id: "C3-081", name: "C3-081 Circular বর্ষাকালে" },
    { id: "C3-082", name: "C3-082 Circular বর্ষাকালে" },
    { id: "C3-083", name: "C3-083 Circular বর্ষাকালে" },
    { id: "C3-084", name: "C3-084 Circular বর্ষাকালে" },
    { id: "C3-085", name: "C3-085 Circular বর্ষাকালে" },
    { id: "C3-086", name: "C3-086 Circular বর্ষাকালে" },
    { id: "C3-087", name: "C3-087 Circular বর্ষাকালে" },
    { id: "C3-088", name: "C3-088 Circular বর্ষাকালে" },
    { id: "C3-089", name: "C3-089 Circular বর্ষাকালে" },
    { id: "C3-090", name: "C3-090 Circular বর্ষাকালে" },
    { id: "C3-091", name: "C3-091 Circular বর্ষাকালে" },
    { id: "C3-092", name: "C3-092 Circular বর্ষাকালে" },
    { id: "C3-093", name: "C3-093 Circular বর্ষাকালে" },
    { id: "C3-094", name: "C3-094 Circular বর্ষাকালে" },
    { id: "C3-095", name: "C3-095 Circular বর্ষাকালে" },
    { id: "C3-096", name: "C3-096 Circular বর্ষাকালে" },
    { id: "C3-097", name: "C3-097 Circular বর্ষাকালে" },
    { id: "C3-098", name: "C3-098 Circular বর্ষাকালে" },
    { id: "C3-099", name: "C3-099 Circular বর্ষাকালে" },
    { id: "C3-100", name: "C3-100 Circular বর্ষাকালে" },
];

const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
});

interface RouteListProps {
    pageNumber: number;
}

const RouteList: React.FC<RouteListProps> = ({ pageNumber }) => {
    const routesPerPage = 20;
    const start = (pageNumber - 1) * routesPerPage;
    const end = start + routesPerPage;
    const routes = MockBusRouteData.slice(start, end);
  
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoutes, setSelectedRoutes] = useState<string[]>(MockBusRouteData.map(route => route.id));
    const [busRoutes, setBusRoutes] = useState<BusRoute[]>(MockBusRouteData);

    const filteredRoutes = routes.filter((route) =>
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
  const [showRoutes, setShowRoutes] = useState(false);
  const [routePage, setRoutePage] = useState(1);

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

  const toggleRoutes = () => {
    setShowRoutes(!showRoutes);
  };

  const renderRoutes = (pageNumber: number) => {
      setRoutePage(pageNumber);
  };

  return (
    <div className="flex h-screen bg-background font-sans antialiased">
      {/* Sidebar */}
      <div className="w-16 p-2 flex flex-col items-center space-y-3 bg-secondary rounded-xl shadow-md h-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setShowRoutes(false)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              Go Back
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleRoutes}>
                  <Bus className="h-5 w-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              Routes
            </TooltipContent>
          </Tooltip>
          <div className="flex-grow" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              Help
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              Toggle Theme
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

        {showRoutes ? (
          <Card className="h-full shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Route Notifications</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="h-48 relative rounded-md overflow-hidden">
                <DynamicMap />
              </div>
              <div className="flex-1 mt-2">
                <RouteList pageNumber={routePage} />
              </div>
              <div className="flex justify-center space-x-2">
                {[...Array(Math.ceil(MockBusRouteData.length / 20))].map((_, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        className={routePage === index + 1 ? "bg-secondary/20" : ""}
                        onClick={() => renderRoutes(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
            </div>
            </CardContent>
          </Card>
        ) : (
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
              </div>

              {activeSection === 'lines' && (
                <div className="p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Line Notifications</h3>
                  <LineNotificationPreferences />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
