using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Allow CORS from the Vite dev server
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
     .AllowAnyMethod()
     .AllowAnyHeader()));

var app = builder.Build();
app.UseCors();

// ── GET /health ────────────────────────────────────────────────────────────
app.MapGet("/health", () =>
{
    bool deviceAvailable = FingerprintCapture.IsDeviceAvailable();
    return Results.Json(new { ok = true, device = deviceAvailable });
});

// ── POST /scan ─────────────────────────────────────────────────────────────
// Captures a live fingerprint from the U.are.U 4500 and returns a base64 template.
app.MapPost("/scan", async () =>
{
    try
    {
        string template = await FingerprintCapture.CaptureAsync();
        return Results.Json(new { ok = true, template });
    }
    catch (Exception ex)
    {
        return Results.Json(new { ok = false, error = ex.Message }, statusCode: 500);
    }
});

// ── POST /verify ───────────────────────────────────────────────────────────
// Compares a live template against a stored one.
// Body: { stored_template: string, live_template: string }
app.MapPost("/verify", async (HttpRequest request) =>
{
    using var reader = new StreamReader(request.Body);
    var body = await reader.ReadToEndAsync();
    var payload = JsonSerializer.Deserialize<VerifyPayload>(body,
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

    if (payload is null || string.IsNullOrEmpty(payload.StoredTemplate) || string.IsNullOrEmpty(payload.LiveTemplate))
        return Results.Json(new { ok = false, error = "Missing templates" }, statusCode: 400);

    try
    {
        var result = FingerprintVerify.Verify(payload.StoredTemplate, payload.LiveTemplate);
        return Results.Json(new { ok = true, match = result.Match, score = result.Score });
    }
    catch (Exception ex)
    {
        return Results.Json(new { ok = false, error = ex.Message }, statusCode: 500);
    }
});

// ── POST /identify ─────────────────────────────────────────────────────────
// Scans a live fingerprint and matches it against ALL stored templates (1:N).
// Body: { templates: [{ worker_id: number, template: string }] }
// Response: { ok, worker_id: number | null, score: number }
app.MapPost("/identify", async (HttpRequest request) =>
{
    using var reader = new StreamReader(request.Body);
    var body = await reader.ReadToEndAsync();
    var payload = JsonSerializer.Deserialize<IdentifyPayload>(body,
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

    if (payload is null || payload.Templates is null || payload.Templates.Length == 0)
        return Results.Json(new { ok = false, error = "No templates provided" }, statusCode: 400);

    try
    {
        // 1. Capture live fingerprint
        string liveTemplate = await FingerprintCapture.CaptureAsync();

        // 2. Match against all stored templates
        int? matchedWorkerId = null;
        int  bestScore       = 0;

        foreach (var entry in payload.Templates)
        {
            var result = FingerprintVerify.Verify(entry.Template, liveTemplate);
            if (result.Match && result.Score > bestScore)
            {
                bestScore       = result.Score;
                matchedWorkerId = entry.WorkerId;
            }
        }

        return Results.Json(new { ok = true, worker_id = matchedWorkerId, score = bestScore });
    }
    catch (Exception ex)
    {
        return Results.Json(new { ok = false, error = ex.Message }, statusCode: 500);
    }
});

app.Run("http://localhost:5100");

record VerifyPayload(string StoredTemplate, string LiveTemplate);
record TemplateEntry(int WorkerId, string Template);
record IdentifyPayload(TemplateEntry[] Templates);
