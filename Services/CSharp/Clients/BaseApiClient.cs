using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Clients
{
    public abstract class BaseApiClient
    {
        protected readonly HttpClient HttpClient;
        protected readonly JsonSerializerOptions JsonOptions;

        protected BaseApiClient(HttpClient httpClient)
        {
            HttpClient = httpClient;
            JsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
            JsonOptions.Converters.Add(new JsonStringEnumConverter(namingPolicy: JsonNamingPolicy.CamelCase));
        }

        protected string BuildUrl(string path, Dictionary<string, string?>? query = null)
        {
            if (query == null || query.Count == 0)
            {
                return path;
            }

            var sb = new StringBuilder(path);
            sb.Append(path.Contains("?") ? '&' : '?');
            var first = true;

            foreach (var (key, value) in query)
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    continue;
                }

                if (!first)
                {
                    sb.Append('&');
                }

                sb.Append(Uri.EscapeDataString(key));
                sb.Append('=');
                sb.Append(Uri.EscapeDataString(value));
                first = false;
            }

            return sb.ToString();
        }

        protected async Task<T?> GetAsync<T>(string path)
        {
            var response = await HttpClient.GetAsync(path);
            response.EnsureSuccessStatusCode();
            var wrapper = await response.Content.ReadFromJsonAsync<ApiResponse<T>>(JsonOptions);
            return wrapper?.Data;
        }

        protected async Task<T> PostAsync<T>(string path, object payload)
        {
            var response = await HttpClient.PostAsJsonAsync(path, payload, JsonOptions);
            response.EnsureSuccessStatusCode();
            var wrapper = await response.Content.ReadFromJsonAsync<ApiResponse<T>>(JsonOptions);
            return wrapper?.Data!;
        }

        protected async Task<T> PutAsync<T>(string path, object payload)
        {
            var response = await HttpClient.PutAsJsonAsync(path, payload, JsonOptions);
            response.EnsureSuccessStatusCode();
            var wrapper = await response.Content.ReadFromJsonAsync<ApiResponse<T>>(JsonOptions);
            return wrapper?.Data!;
        }

        protected async Task<bool> DeleteAsync(string path)
        {
            var response = await HttpClient.DeleteAsync(path);
            return response.IsSuccessStatusCode;
        }
    }
}
