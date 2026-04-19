using DPFP;
using DPFP.Capture;
using DPFP.Processing;

/// <summary>
/// Captures a fingerprint from the U.are.U 4500 reader.
/// Uses the DigitalPersona DPFP SDK (DPFP.dll).
/// </summary>
public static class FingerprintCapture
{
    private static readonly TimeSpan CaptureTimeout = TimeSpan.FromSeconds(15);

    /// <summary>
    /// Returns true if a U.are.U device is connected and accessible.
    /// </summary>
    public static bool IsDeviceAvailable()
    {
        try
        {
            using var capture = new Capture(DPFP.Capture.Priority.Normal);
            return capture != null;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Captures a fingerprint and returns a base64-encoded DP template string.
    /// Throws if no device is found or capture times out.
    /// </summary>
    public static Task<string> CaptureAsync()
    {
        var tcs = new TaskCompletionSource<string>();
        var cts = new CancellationTokenSource(CaptureTimeout);

        cts.Token.Register(() =>
        {
            if (!tcs.Task.IsCompleted)
                tcs.TrySetException(new TimeoutException("Fingerprint capture timed out."));
        });

        Capture? capture = null;
        CaptureHandler? handler = null;

        handler = new CaptureHandler(
            onComplete: (sample) =>
            {
                try
                {
                    capture?.StopCapture();
                    var extractor = new FeatureExtraction();
                    var features  = new FeatureSet();
                    var quality   = extractor.CreateFeatureSet(sample, DataPurpose.Enrollment, ref features);

                    if (quality != CaptureFeedback.Good)
                    {
                        tcs.TrySetException(new InvalidOperationException($"Poor quality scan: {quality}"));
                        return;
                    }

                    var enrollee = new Enrollment();
                    enrollee.AddFeatures(features);

                    if (enrollee.TemplateStatus == Enrollment.Status.Ready)
                    {
                        var template = enrollee.Template;
                        using var ms = new System.IO.MemoryStream();
                        template.Serialize(ms);
                        tcs.TrySetResult(Convert.ToBase64String(ms.ToArray()));
                    }
                    else
                    {
                        tcs.TrySetException(new InvalidOperationException("Enrollment not ready."));
                    }
                }
                catch (Exception ex)
                {
                    tcs.TrySetException(ex);
                }
            },
            onError: (ex) => tcs.TrySetException(ex)
        );

        try
        {
            capture = new Capture(DPFP.Capture.Priority.Normal);
            capture.EventHandler = handler;
            capture.StartCapture();
        }
        catch (Exception ex)
        {
            tcs.TrySetException(new InvalidOperationException("Could not start capture. Is the device connected?", ex));
        }

        return tcs.Task;
    }
}

/// <summary>
/// Internal event handler for the DPFP capture session.
/// </summary>
internal class CaptureHandler : DPFP.Capture.EventHandler
{
    private readonly Action<Sample> _onComplete;
    private readonly Action<Exception> _onError;

    public CaptureHandler(Action<Sample> onComplete, Action<Exception> onError)
    {
        _onComplete = onComplete;
        _onError    = onError;
    }

    public void OnComplete(object capture, string readerSerialNumber, Sample sample)
        => _onComplete(sample);

    public void OnFingerGone(object capture, string readerSerialNumber) { }
    public void OnFingerTouch(object capture, string readerSerialNumber) { }

    public void OnReaderConnect(object capture, string readerSerialNumber) { }
    public void OnReaderDisconnect(object capture, string readerSerialNumber)
        => _onError(new InvalidOperationException("Reader disconnected during capture."));

    public void OnSampleQuality(object capture, string readerSerialNumber, CaptureFeedback captureFeedback) { }
}
