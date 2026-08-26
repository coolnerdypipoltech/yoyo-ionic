# YoYo Ionic — Estado del proyecto

Resumen para retomar esta conversación en otra sesión. Última actualización: 2026-08-25.

## Qué es esto

Migración de la app YoYo (club nocturno/rewards por invitación) de Unity a **Ionic React + Capacitor**, hacia paridad de datos con el backend Laravel real (`admin.yoyotheclub.com`) y ahora en una segunda fase de **rediseño visual** contra capturas de referencia que fue compartiendo el usuario.

Repo: `C:\Users\dylan\Documents\CNP\yoyo-ionic` (Windows) — conectado a `github.com/coolnerdypipoltech/yoyo-ionic`. El usuario también trabaja desde un Mac (`~/Documents/GitHub/yoyo-ionic`) compilando iOS/Android nativo con Xcode/Android Studio, y **edita archivos directamente él mismo en paralelo** (fuentes custom, iconos SVG, ajustes de color) — antes de tocar un archivo, revisar si cambió en disco.

**Hay cambios sin commitear** (`git status` muestra varios archivos modificados sin stage). No se ha commiteado nada en esta sesión — el usuario no lo ha pedido.

## Stack fijado (no actualizar sin razón)

```
@ionic/react@8.8.19  @ionic/react-router@8.8.19
react@18.3.1  react-dom@18.3.1          ← NO subir a 19, rompe con react-router v5
react-router@5.3.4  react-router-dom@5.3.4   ← @ionic/react-router sigue pineado a v5
@capacitor/core@8.5.0  @capacitor/preferences  @capacitor/camera  @capacitor/ios  @capacitor/android
i18next + react-i18next  (en/es)
typescript@5.9.3          ← NO usar "latest" (es la 7.x nueva, tsgo, no probada)
```

Ver [package.json](package.json) para la lista completa.

## Arquitectura clave

- **Dos árboles de router separados** ([App.tsx](src/App.tsx)): `UnauthenticatedApp` y `AuthenticatedApp`, cada uno con su propio `IonReactRouter`. Se decidió así (no un solo router compartido) después de pelear con dos bugs reales de Ionic con outlets anidados — ver sección de bugs abajo.
- `AuthContext` ([context/AuthContext.tsx](src/context/AuthContext.tsx)) sincroniza la URL con `window.history.replaceState` **antes** de cambiar `isAuthenticated`, para que el router que se monta ya arranque en una ruta válida.
- `MainTabs` ([routes/MainTabs.tsx](src/routes/MainTabs.tsx)): tab bar flotante con efecto glass, iconos de conejo (Places, ON=rojo/OFF=gris) y una corona SVG (Rewards).
- Capa de API en `src/api/` (httpClient + services por dominio), tipos en `src/api/types.ts`. Ver [Yoyo-API-Reference.md] (artefacto en claude.ai, no en el repo) para el contrato completo del backend.
- i18n: `src/i18n/locales/{en,es}/*.json`, namespaces `common, auth, main, profile, faqs, errors`.

## Pantallas — estado

| Pantalla | Backend/lógica | Rediseño visual |
|---|---|---|
| Welcome, Login, VerifyCode, PasswordRecovery | ✅ | ✅ contra captura |
| Register | ✅ | ⚠️ sin captura de referencia — estilo genérico consistente |
| Places, Rewards (tabs) | ✅ | ✅ contra captura |
| PlacesInfo, RewardsInfo | ✅ | ✅ contra captura |
| Config (menú bottom-sheet) | ✅ | ✅ contra captura |
| Profile/AccountSettings, EditProfile, EditTaste | ✅ | ✅ contra captura |
| DeleteAccount | ✅ | ⚠️ sin captura de referencia |
| Faqs | ✅ | ✅ layout, ⚠️ contenido placeholder (ver abajo) |

## Sistema de diseño

- Fondo negro fijo (`--ion-background-color:#000000`, no depende de light/dark del sistema).
- Colores: rojo primario `#751518` (marca), teal `#3ecfb2` (aproximado, no confirmado con el usuario), definidos en [theme/variables.css](src/theme/variables.css).
- Fuentes: el usuario agregó sus propias fuentes custom (`InstrumentSans-*`, `InstrumentSerif-Regular`) en `src/assets/fonts/` con `@font-face` en [theme/global.css](src/theme/global.css) — reemplazan las que yo había puesto (Playfair Display/Anton vía Google Fonts, ya no se usan).
- Assets propios del usuario en `src/assets/icons/`: `Back.svg`, `Icon_rabbit.svg`, `Visibility.svg`, `Visibility_Off.svg`, `YoyoLetters.png` — se van agregando sobre la marcha, revisar esa carpeta antes de asumir qué existe.
- **Video de fondo**: `BackgroundVideo` component ([components/BackgroundVideo/](src/components/BackgroundVideo/)), montado una sola vez en `UnauthenticatedApp.tsx` (`welcome-video.mp4`) y en `MainTabs.tsx` (`main-vieo.mp4`, nota el typo en el nombre del archivo real). Las páginas correspondientes tienen `--background: transparent` para que se vea. **Los dos videos son actualmente el mismo archivo (mismo hash MD5)** — placeholder duplicado, 21MB cada uno — avisar si conviene comprimirlos antes de shippear (afecta tamaño del bundle nativo).
- Tarjeta de lealtad (`LoyaltyCard`): 3D real con grosor (paneles de canto en Z), drag-to-tilt en vivo mientras se sostiene, snap a la cara más cercana al soltar (no requiere completar 90°).

## Bugs reales encontrados y su causa (para no repetirlos)

1. **Pantalla negra tras login / logout no regresaba a Welcome**: causa raíz — con un solo `IonRouterOutlet` compartido conteniendo rutas públicas y el `IonTabs` anidado, Ionic (`ReactRouterViewStack`) a veces le pone `ion-page-hidden` (`display:none`) a la página que se va sin que el outlet correcto la reemplace. Fix: volver a dos routers separados + sincronizar la URL a mano antes de montar cada uno (ver arquitectura arriba).
2. **Rebote raro al arrastrar la tarjeta de lealtad**: el cálculo del snap hacía dos redondeos independientes (vuelta completa más cercana + ¿frente o reverso?) que podían no coincidir cerca de ±270°. Fix: un solo `Math.round(liveRotation / 180) * 180`.
3. **Botones inalcanzables bajo el notch en iPhone real**: faltaba `viewport-fit=cover` en `index.html` — sin eso `env(safe-area-inset-top)` siempre da `0px` aunque el WebView de Capacitor renderice edge-to-edge. Ya corregido, más `env(safe-area-inset-top)` agregado a los botones de cerrar sueltos (EditTaste/Faqs/DeleteAccount) que no vivían dentro de un `IonHeader`.

## Pendiente / requiere info del usuario

- **FAQ**: solo hay respuesta real para "What is YoYo, really?" — las otras 9 preguntas en [i18n/locales/en/faqs.json](src/i18n/locales/en/faqs.json) tienen `placeholderAnswer` genérico. Falta el contenido real.
- **Privacy Policy / Terms URLs**: placeholders en [api/config.ts](src/api/config.ts) (`PRIVACY_POLICY_URL`, `TERMS_URL`), marcados con `// TODO`.
- Register y DeleteAccount no tienen captura de referencia — si el usuario tiene diseño para esas pantallas, falta aplicarlo.
- Color teal exacto y tipografía del logo "YOYO" wordmark eran aproximaciones antes de que el usuario empezara a meter sus propios assets — revisar si ya quedó resuelto con lo que él agregó.

## Cómo correr / verificar

```bash
npm run dev                 # servidor de desarrollo (Vite, puerto 5173)
npx tsc -p tsconfig.app.json --noEmit   # type-check rápido
npm run build                # build de producción, valida que todo compile
```

Para probar en dispositivo/simulador (después de cualquier cambio de código):

```bash
npm run build
npx cap sync                # copia dist/ a ios/ y android/, instala pods nativos
npx cap open ios            # o: npx cap open android
```

Credenciales de prueba contra el backend real: `dylanomar@live.com.mx` / `Password123+`.

## Notas de entorno

- El dev server en `localhost:5173` a veces queda huérfano entre sesiones (proceso `node.exe` viejo) — si `preview_start` con `name` falla por puerto ocupado, conectar directo con `preview_start` usando `url: "http://localhost:5173"`.
- El navegador de pruebas corre en segundo plano (`document.hidden: true`), lo que **throttlea `requestAnimationFrame`** — cualquier verificación que dependa de animaciones CSS o gestos en vivo (como el tilt de la tarjeta) no se puede observar fotograma a fotograma ahí; hay que confiar en la lógica verificada por otros medios (computed styles, eventos sintéticos con `view: window` en `MouseEvent`) o pedirle al usuario que lo pruebe directo.
