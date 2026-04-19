using DPFP;
using DPFP.Verification;

/// <summary>
/// Verifies a live fingerprint template against a stored one.
/// Uses the DigitalPersona DPFP SDK verification engine.
/// </summary>
public static class FingerprintVerify
{
    public record VerifyResult(bool Match, int Score);

    /// <summary>
    /// Compares two base64-encoded DP templates.
    /// Returns match result and FAR score.
    /// </summary>
    public static VerifyResult Verify(string storedBase64, string liveBase64)
    {
        // Deserialize stored template
        var storedBytes = Convert.FromBase64String(storedBase64);
        var storedTemplate = new Template();
        using (var ms = new System.IO.MemoryStream(storedBytes))
            storedTemplate.DeSerialize(ms);

        // Deserialize live template
        var liveBytes = Convert.FromBase64String(liveBase64);
        var liveTemplate = new Template();
        using (var ms = new System.IO.MemoryStream(liveBytes))
            liveTemplate.DeSerialize(ms);

        // Run verification
        var verification = new Verification();
        var result = new Verification.Result();

        // FAR (False Accept Rate) = 0.001% — strict matching
        verification.Verify(liveTemplate, storedTemplate, ref result);

        return new VerifyResult(result.Verified, result.FARAchieved);
    }
}
