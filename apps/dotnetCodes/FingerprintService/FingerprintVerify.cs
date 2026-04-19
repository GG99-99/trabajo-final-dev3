using DPUruNet;

public static class FingerprintVerify
{
    // FAR 0.001% — standard threshold for high-security matching
    private const int FAR_THRESHOLD = 21474;

    public record VerifyResult(bool Match, int Score);

    public static VerifyResult Verify(string storedFmdB64, string liveFmdB64)
    {
        var stored = ImportFmd(storedFmdB64);
        var live   = ImportFmd(liveFmdB64);

        var result = Comparison.Compare(live, 0, stored, 0);
        if (result.ResultCode != Constants.ResultCode.DP_SUCCESS)
            throw new InvalidOperationException($"Comparison failed: {result.ResultCode}");

        return new VerifyResult(result.Score < FAR_THRESHOLD, result.Score);
    }

    public static (int? WorkerId, int Score) Identify(
        string liveFmdB64,
        IEnumerable<(int WorkerId, string TemplateB64)> stored)
    {
        var live      = ImportFmd(liveFmdB64);
        int? bestId   = null;
        int  bestScore = int.MaxValue;

        foreach (var (wid, tmpl) in stored)
        {
            try
            {
                var storedFmd = ImportFmd(tmpl);
                var result    = Comparison.Compare(live, 0, storedFmd, 0);
                if (result.ResultCode == Constants.ResultCode.DP_SUCCESS
                    && result.Score < FAR_THRESHOLD
                    && result.Score < bestScore)
                {
                    bestScore = result.Score;
                    bestId    = wid;
                }
            }
            catch { /* skip bad templates */ }
        }

        return (bestId, bestScore == int.MaxValue ? 0 : bestScore);
    }

    private static Fmd ImportFmd(string base64)
    {
        var bytes  = Convert.FromBase64String(base64);
        var result = Importer.ImportFmd(bytes, Constants.Formats.Fmd.ANSI, Constants.Formats.Fmd.ANSI);
        if (result.ResultCode != Constants.ResultCode.DP_SUCCESS)
            throw new InvalidOperationException($"ImportFmd failed: {result.ResultCode}");
        return result.Data!;
    }
}
