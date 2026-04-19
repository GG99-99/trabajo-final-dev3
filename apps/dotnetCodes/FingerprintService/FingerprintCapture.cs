using DPUruNet;

public static class FingerprintCapture
{
    private const int CAPTURE_TIMEOUT_MS = 15000; // 15 seconds

    public static bool IsDeviceAvailable()
    {
        try { return ReaderCollection.GetReaders().Count > 0; }
        catch { return false; }
    }

    private static Reader OpenReader()
    {
        var readers = ReaderCollection.GetReaders();
        if (readers.Count == 0)
            throw new InvalidOperationException("No U.are.U reader found. Please connect the device.");

        var reader = readers[0];
        var rc = reader.Open(Constants.CapturePriority.DP_PRIORITY_EXCLUSIVE);
        if (rc != Constants.ResultCode.DP_SUCCESS)
            throw new InvalidOperationException($"Could not open reader: {rc}");
        return reader;
    }

    private static int GetNativeResolution(Reader reader)
    {
        var resolutions = reader.Capabilities.Resolutions;
        if (resolutions == null || resolutions.Length == 0)
            throw new InvalidOperationException("Reader reported no supported resolutions.");
        Console.WriteLine($"[Capture] Supported resolutions: {string.Join(", ", resolutions)}");
        return resolutions[0];
    }

    /// <summary>
    /// Captures one Fmd from the reader (blocking call).
    /// Returns base64-encoded Fmd bytes.
    /// </summary>
    public static Task<string> CaptureFmdAsync()
    {
        return Task.Run(() =>
        {
            using var reader = OpenReader();

            var resolution = GetNativeResolution(reader);
            Console.WriteLine($"[Capture] Using resolution={resolution}, format=ANSI, processing=DP_IMG_PROC_DEFAULT, timeout={CAPTURE_TIMEOUT_MS}ms");

            var captureResult = reader.Capture(
                Constants.Formats.Fid.ANSI,
                Constants.CaptureProcessing.DP_IMG_PROC_DEFAULT,
                CAPTURE_TIMEOUT_MS,
                resolution);

            if (captureResult.ResultCode != Constants.ResultCode.DP_SUCCESS)
                throw new InvalidOperationException($"Capture failed: {captureResult.ResultCode}");

            if (captureResult.Quality != Constants.CaptureQuality.DP_QUALITY_GOOD)
                throw new InvalidOperationException(
                    $"Poor quality ({captureResult.Quality}). Place your finger flat and clean on the reader.");

            // Extract Fmd from the raw Fid image
            var extractResult = FeatureExtraction.CreateFmdFromFid(
                captureResult.Data!,
                Constants.Formats.Fmd.ANSI);

            if (extractResult.ResultCode != Constants.ResultCode.DP_SUCCESS)
                throw new InvalidOperationException($"Feature extraction failed: {extractResult.ResultCode}");

            return Convert.ToBase64String(extractResult.Data!.Bytes);
        });
    }
}
