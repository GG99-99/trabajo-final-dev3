# U.are.U 4500 Fingerprint Service (.NET)

Servicio local en ASP.NET Core que expone una API HTTP para capturar y verificar huellas digitales usando el SDK de DigitalPersona (DPFP).

## Requisitos

- Windows 10/11
- .NET 8 SDK: https://dotnet.microsoft.com/download
- Driver U.are.U 4500: instalar desde el CD del dispositivo o descargar de https://www.hidglobal.com/drivers
- SDK DigitalPersona: `DPFP.dll` y `DPFPGui.dll` (incluidos con el driver, normalmente en `C:\Program Files\DigitalPersona\`)

## Estructura del proyecto

```
FingerprintService/
├── FingerprintService.csproj
├── Program.cs
├── FingerprintCapture.cs
└── FingerprintVerify.cs
```

## Endpoints

| Method | Path      | Body                                      | Response                              |
|--------|-----------|-------------------------------------------|---------------------------------------|
| POST   | /scan     | —                                         | `{ ok, template: "<base64>" }`        |
| POST   | /verify   | `{ stored_template, live_template }`      | `{ ok, match: bool, score: number }`  |
| GET    | /health   | —                                         | `{ ok: true, device: bool }`          |

## Instalación y ejecución

```bash
cd FingerprintService
dotnet restore
dotnet run
# Escucha en http://localhost:5100
```

## Notas importantes

- El servicio debe correr en la misma máquina donde está conectado el lector USB.
- El frontend llama a `http://localhost:5100` directamente (no pasa por el backend Node.js).
- Si el dispositivo no está conectado, el frontend entra en "manual mode" y permite el ponche sin huella.
