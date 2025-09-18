$port = 8080
$path = (Get-Item -Path '.').FullName

Write-Host "Serving $path at http://localhost:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = $request.Url.LocalPath
    if ($localPath -eq '/') { $localPath = '/index.html' }
    
    $filePath = Join-Path $path $localPath
    
    if (Test-Path $filePath) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $notFoundContent = "<h1>404 Not Found</h1><p>The requested URL $localPath was not found on this server.</p>"
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($notFoundContent)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    
    $response.Close()
}
