using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace ClinicaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WatsonController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private readonly ILogger<WatsonController> _logger;

    public WatsonController(
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        ILogger<WatsonController> logger)
    {
        _configuration = configuration;
        _httpClient = httpClientFactory.CreateClient();
        _logger = logger;
    }

    [HttpPost("message")]
    public async Task<IActionResult> SendMessage([FromBody] WatsonMessageRequest request)
    {
        try
        {
            var apiKey = _configuration["Watson:ApiKey"];
            var assistantId = _configuration["Watson:AssistantId"];
            var url = _configuration["Watson:Url"];
            var version = _configuration["Watson:Version"] ?? "2021-11-27";

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(assistantId))
            {
                return BadRequest(new { error = "Watson Assistant no está configurado correctamente" });
            }

            // Crear sesión si no existe
            var sessionId = request.SessionId;
            if (string.IsNullOrEmpty(sessionId))
            {
                sessionId = await CreateSession(url, assistantId, version, apiKey);
            }

            // Enviar mensaje a Watson
            var watsonUrl = $"{url}/v2/assistants/{assistantId}/sessions/{sessionId}/message?version={version}";

            var messagePayload = new
            {
                input = new
                {
                    message_type = "text",
                    text = request.Message
                }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(messagePayload),
                Encoding.UTF8,
                "application/json"
            );

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Basic {Convert.ToBase64String(Encoding.ASCII.GetBytes($"apikey:{apiKey}"))}");

            var response = await _httpClient.PostAsync(watsonUrl, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"Error de Watson Assistant: {responseContent}");
                return StatusCode((int)response.StatusCode, new { error = "Error al comunicarse con Watson Assistant" });
            }

            var watsonResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);

            return Ok(new
            {
                output = watsonResponse.GetProperty("output"),
                sessionId = sessionId
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al procesar mensaje de Watson");
            return StatusCode(500, new { error = "Error interno del servidor" });
        }
    }

    private async Task<string> CreateSession(string url, string assistantId, string version, string apiKey)
    {
        var sessionUrl = $"{url}/v2/assistants/{assistantId}/sessions?version={version}";

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Basic {Convert.ToBase64String(Encoding.ASCII.GetBytes($"apikey:{apiKey}"))}");

        var response = await _httpClient.PostAsync(sessionUrl, null);
        var content = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Error al crear sesión de Watson: {content}");
        }

        var sessionResponse = JsonSerializer.Deserialize<JsonElement>(content);
        return sessionResponse.GetProperty("session_id").GetString() ?? throw new Exception("No se pudo obtener session_id");
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook([FromBody] JsonElement payload)
    {
        try
        {
            // Manejar webhooks de Watson Assistant
            // Aquí puedes procesar acciones específicas del asistente
            
            _logger.LogInformation($"Webhook recibido: {payload}");

            // Ejemplo: Detectar intención de agendar cita
            if (payload.TryGetProperty("output", out var output))
            {
                if (output.TryGetProperty("intents", out var intents))
                {
                    var intentsArray = intents.EnumerateArray();
                    foreach (var intent in intentsArray)
                    {
                        var intentName = intent.GetProperty("intent").GetString();
                        
                        if (intentName == "agendar_cita")
                        {
                            // Lógica para agendar cita
                            return Ok(new
                            {
                                response = "Te ayudaré a agendar tu cita. ¿Qué especialidad necesitas?",
                                action = "show_specialties"
                            });
                        }
                        else if (intentName == "consultar_citas")
                        {
                            // Lógica para consultar citas
                            return Ok(new
                            {
                                response = "Consultando tus citas programadas...",
                                action = "show_appointments"
                            });
                        }
                    }
                }
            }

            return Ok(new { received = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en webhook de Watson");
            return StatusCode(500, new { error = "Error al procesar webhook" });
        }
    }
}

public class WatsonMessageRequest
{
    public string Message { get; set; } = string.Empty;
    public string? SessionId { get; set; }
}
