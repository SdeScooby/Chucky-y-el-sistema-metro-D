# **App Name**: AppMiMetro

## Core Features:

- Notification Preferences: Allow users to toggle notifications for each metro line, tranvia, metrocable, and integrated buses.
- Real-Time Alerts: Display real-time alerts with the type of disruption, estimated duration, and suggested alternatives.
- Offline Mode: Show the latest available information when offline, with a clear indication that it may be outdated.

## Style Guidelines:

- Primary color: Use the representative green of the Metro de Medellin for the header and main elements.
- Background color: Light gray, in the style of the Metro de Medellin.
- Details: Add darker green details to the main elements for a deeper contrast.
- Accent: Use a bright orange (#FF9800) for alerts and important notifications to grab user attention.
- Use a card-based layout for displaying alerts and line status information.
- Use clear and recognizable icons for each mode of transport (metro, tram, bus).
- Subtle animations for loading alerts and updating status information.

## Original User Request:
con base en esta imagen, crea una interfaz funcional siguiendo la siguiente historia de usuario: 



Notificaciones en tiempo real sobre el estado de la red de transporte
Historia de Usuario:
Como usuario frecuente del Metro de Medellín, quiero recibir notificaciones en tiempo real sobre retrasos, cierres o problemas en las diferentes líneas de transporte, para poder planear mejor mis trayectos y evitar contratiempos
Criterios de Aceptación:
El usuario podrá activar o desactivar notificaciones para cada línea del metro, tranvía, metro cables y buses integrados.
Las notificaciones deben incluir: tipo de afectación, duración estimada y alternativas sugeridas.
Se debe mostrar una alerta clara en la app en caso de una afectación en la red.
La información debe actualizarse en tiempo real desde una fuente oficial del Metro.
Si no hay conexión a internet, se mostrará la última información disponible con un aviso de que puede estar desactualizada.
Notas Técnicas:
Integrar con el sistema de alertas del Metro de Medellín vía API (en caso de disponibilidad)
Las notificaciones deben poder configurarse desde la sección de “Preferencias del usuario”
Guardar preferencias de notificación localmente en el dispositivo y sincronizarlas con la cuenta del usuario
  