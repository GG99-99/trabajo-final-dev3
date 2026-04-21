using System.Text.Json;
using System.Text.Json.Serialization;
using DPUruNet;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:5173","http://localhost:5174","http://localhost:5175")
     .AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();
app.UseCors();

// GET /health
app.MapGet("/health", () =>
{
    bool device = false;
    string? deviceError = null;
    try { device = FingerprintCapture.IsDeviceAvailable(); }
    catch (Exception ex) { deviceError = $"{ex.GetType().Name}: {ex.Message}"; }
    return Results.Json(new { ok = true, device, deviceError });
});

// POST /enroll/step — capture one Fmd (call 4 times)
app.MapPost("/enroll/step", async () =>
{
    try
    {
        var fmdB64 = await FingerprintCapture.CaptueFmdAsync();
        return Results.Json(new { ok = true, fmd_b64 = fmdB64 });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[enroll/step ERROR] {ex.GetType().Name}: {ex.Message}");
        if (ex.InnerException != null)
            Console.WriteLine($"[enroll/step INNER] {ex.InnerException.GetType().Name}: {ex.InnerException.Message}");
        return Results.Json(new { ok = false, error = ex.Message }, statusCode: 500);
    }
});

// POST /enroll/finish — build enrollment template from 4 Fmds
// Body: { fmds: string[] }
app.MapPost("/enroll/finish", async (HttpRequest req) =>
{
    using var sr = new StreamReader(req.Body);
    var payload = JsonSerializer.Deserialize<EnrollFinishPayload>(
        await sr.ReadToEndAsync(),
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

    if (payload?.Fmds == null || payload.Fmds.Length < 4)
        return Results.Json(new { ok = false, error = "Need 4 Fmd captures." }, statusCode: 400);

    try
    {
        // Import all Fmds
        var fmdList = new List<Fmd>();
        foreach (var b64 in payload.Fmds)
        {
            var bytes  = Convert.FromBase64String(b64);
            var import = Importer.ImportFmd(bytes, Constants.Formats.Fmd.ANSI, Constants.Formats.Fmd.ANSI);
            if (import.ResultCode != Constants.ResultCode.DP_SUCCESS)
                return Results.Json(new { ok = false, error = $"Bad Fmd: {import.ResultCode}" }, statusCode: 422);
            fmdList.Add(import.Data!);
        }

        // CreateEnrollmentFmd(Constants.Formats.Fmd format, IEnumerable<Fmd> gallery)
        var final = Enrollment.CreateEnrollmentFmd(Constants.Formats.Fmd.ANSI, fmdList);
        if (final.ResultCode != Constants.ResultCode.DP_SUCCESS)
            return Results.Json(new { ok = false, error = $"Enrollment failed: {final.ResultCode}. Re-scan." }, statusCode: 422);

        return Results.Json(new { ok = true, template_b64 = Convert.ToBase64String(final.Data!.Bytes) });
    }
    catch (Exception ex) { return Results.Json(new { ok = false, error = ex.Message }, statusCode: 500); }
});

// POST /verify — capture live Fmd and compare against stored template
// Body: { stored_template_b64: string }
app.MapPost("/verify", async (HttpRequest req) =>
{
    using var sr = new StreamReader(req.Body);
    var payload = JsonSerializer.Deserialize<VerifyPayload>(
        await sr.ReadToEndAsync(),
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

    if (string.IsNullOrEmpty(payload?.StoredTemplateB64))
        return Results.Json(new { ok = false, error = "Missing stored_template_b64" }, statusCode: 400);

    try
    {
        var liveFmdB64 = await FingerprintCapture.CaptureFmdAsync();
        var result     = FingerprintVerify.Verify(payload.StoredTemplateB64, liveFmdB64);
        return Results.Json(new { ok = true, match = result.Match, score = result.Score });
    }
    catch (Exception ex) { return Results.Json(new { ok = false, error = ex.Message }, statusCode: 500); }
});

// POST /identify — capture live Fmd and match 1:N
// Body: { templates: [{ worker_id, template_b64 }] }
app.MapPost("/identify", async (HttpRequest req) =>
{
    using var sr = new StreamReader(req.Body);
    var payload = JsonSerializer.Deserialize<IdentifyPayload>(
        await sr.ReadToEndAsync(),
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

    if (payload?.Templates == null || payload.Templates.Length == 0)
        return Results.Json(new { ok = false, error = "No templates." }, statusCode: 400);

    try
    {
        var liveFmdB64 = await FingerprintCapture.CaptureFmdAsync();
        var stored     = payload.Templates
            .Where(t => !string.IsNullOrEmpty(t.TemplateB64))
            .Select(t => (t.WorkerId, t.TemplateB64!));

        var (workerId, score) = FingerprintVerify.Identify(liveFmdB64, stored);
        return Results.Json(new { ok = true, worker_id = workerId, score });
    }
    catch (Exception ex) { return Results.Json(new { ok = false, error = ex.Message }, statusCode: 500); }
});

app.Run("http://localhost:5100");

record EnrollFinishPayload(string[] Fmds);
record VerifyPayload([property: JsonPropertyName("stored_template_b64")] string StoredTemplateB64);
record TemplateEntry(
    [property: JsonPropertyName("worker_id")]    int    WorkerId,
    [property: JsonPropertyName("template_b64")] string? TemplateB64);
record IdentifyPayload(TemplateEntry[] Templates);
