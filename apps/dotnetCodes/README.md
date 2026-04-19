# U.are.U 4500 Fingerprint Service (.NET)

Servicio local en ASP.NET Core que expone una API HTTP para capturar y verificar huellas digitales
usando el SDK **DPUruNet** de DigitalPersona (el que viene con el RTE, no el SDK separado).

---

## Requisitos

- Windows 10/11 (64-bit)
- .NET 8 SDK: https://dotnet.microsoft.com/download
- Driver U.are.U 4500 non-WBF instalado (ya lo tienes)
- DLLs del RTE en la carpeta `libs\` (ver paso 1)

---

## Paso 1 — Copiar las DLLs a `libs\`

Abre PowerShell como administrador y corre:

```powershell
cd "C:\Users\gamep\Documents\GitHub\trabajo-final-dev3\.vscode\dotnetCodes\FingerprintService"
mkdir libs -Force

copy "C:\Program Files\DigitalPersona\U.are.U RTE\Windows\Lib\DotNET\DPUruNet.dll"    libs\
copy "C:\Program Files\DigitalPersona\U.are.U RTE\Windows\Lib\DotNET\DPCtlUruNet.dll" libs\
copy "C:\Program Files\DigitalPersona\U.are.U RTE\Windows\Lib\DotNET\DPXUru.dll"      libs\
```

---

## Paso 2 — Compilar

```powershell
cd "C:\Users\gamep\Documents\GitHub\trabajo-final-dev3\.vscode\dotnetCodes\FingerprintService"
dotnet restore
dotnet build
```

Si compila sin errores verás: `Build succeeded.`

---

## Paso 3 — Correr el servicio

```powershell
dotnet run
```

Deberías ver:
```
Now listening on: http://localhost:5100
```

---

## Paso 4 — Verificar que funciona

Con el lector U.are.U 4500 **conectado por USB**, abre el browser en:

```
http://localhost:5100/health
```

Respuesta esperada:
```json
{ "ok": true, "device": true }
```

Si `device` es `false`, el lector no está siendo detectado — asegúrate de que el driver non-WBF esté instalado y el dispositivo conectado.

---

## Endpoints

| Method | Path        | Body                                              | Response                                      |
|--------|-------------|---------------------------------------------------|-----------------------------------------------|
| GET    | /health     | —                                                 | `{ ok, device: bool }`                        |
| POST   | /scan       | —                                                 | `{ ok, template: "<base64>" }`                |
| POST   | /verify     | `{ stored_template, live_template }`              | `{ ok, match: bool, score: number }`          |
| POST   | /identify   | `{ templates: [{ worker_id, template }] }`        | `{ ok, worker_id: number\|null, score }`      |

---

## Errores comunes

### `Could not open reader: DP_DEVICE_BUSY`
Otro proceso está usando el lector. Cierra cualquier software de DigitalPersona abierto.

### `No fingerprint reader found`
- Verifica que el lector esté conectado por USB
- Verifica en Device Manager que aparece como "DigitalPersona U.are.U 4500" sin errores
- Reinstala el driver non-WBF

### Error de DLL no encontrada al compilar
Asegúrate de que las 3 DLLs estén en la carpeta `libs\` del proyecto.

### `PlatformNotSupportedException`
El proyecto está configurado como `x86`. Asegúrate de correr con `dotnet run` sin flags de plataforma.

---

## Arquitectura del sistema

```
Frontend (Vite :5173)
    │
    ├── POST http://localhost:5100/scan       ← directo al servicio .NET
    ├── POST http://localhost:5100/verify     ← directo al servicio .NET
    ├── POST http://localhost:5100/identify   ← directo al servicio .NET
    │
    └── POST http://localhost:3000/api/punch/in    ← backend Node.js → DB
        POST http://localhost:3000/api/punch/out
        POST http://localhost:3000/api/fingerprints
```

El servicio .NET **solo** se comunica con el hardware.
El backend Node.js **solo** persiste datos en la base de datos.
El frontend orquesta ambos.
