$ErrorActionPreference = 'Stop'

$prefix = 'http://localhost:8000/'
$root = (Get-Location).Path

Write-Host "Serving $root at $prefix"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()

function Get-ContentType($path) {
	$ext = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
	switch ($ext) {
		'.html' { 'text/html; charset=utf-8' }
		'.htm'  { 'text/html; charset=utf-8' }
		'.css'  { 'text/css; charset=utf-8' }
		'.js'   { 'application/javascript; charset=utf-8' }
		'.json' { 'application/json; charset=utf-8' }
		'.png'  { 'image/png' }
		'.jpg'  { 'image/jpeg' }
		'.jpeg' { 'image/jpeg' }
		'.gif'  { 'image/gif' }
		'.svg'  { 'image/svg+xml; charset=utf-8' }
		'.ico'  { 'image/x-icon' }
		'.txt'  { 'text/plain; charset=utf-8' }
		'.webm' { 'audio/webm' }
		default { 'application/octet-stream' }
	}
}

while ($listener.IsListening) {
	try {
		$context = $listener.GetContext()
		$request = $context.Request
		$response = $context.Response

		$relPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath.TrimStart('/'))
		if ([string]::IsNullOrWhiteSpace($relPath)) { $relPath = 'index.html' }
		$localPath = Join-Path $root $relPath

		if ((Test-Path $localPath) -and -not (Get-Item $localPath).PSIsContainer) {
			try {
				$bytes = [System.IO.File]::ReadAllBytes($localPath)
				$contentType = Get-ContentType $localPath
				$response.Headers.Add('Cache-Control','no-cache, no-store, must-revalidate')
				$response.Headers.Add('Pragma','no-cache')
				$response.Headers.Add('Expires','0')
				$response.ContentType = $contentType
				$response.ContentLength64 = $bytes.Length
				$response.OutputStream.Write($bytes, 0, $bytes.Length)
				$response.StatusCode = 200
			}
			catch {
				$response.StatusCode = 500
				$err = [System.Text.Encoding]::UTF8.GetBytes("Internal Server Error: $($_.Exception.Message)")
				$response.OutputStream.Write($err, 0, $err.Length)
			}
		}
		else {
			$response.StatusCode = 404
			$msg = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
			$response.OutputStream.Write($msg, 0, $msg.Length)
		}
	}
	finally {
		if ($null -ne $context) { $context.Response.OutputStream.Close() }
	}
}

finally { $listener.Stop(); $listener.Close() }



