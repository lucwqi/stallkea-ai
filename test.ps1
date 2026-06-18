using System.Net;
using System.IO;

$request = [System.Net.WebRequest]::Create('https://stalkeaa-delta.vercel.app/api/checkout/pix')
$request.Method = 'POST'
$request.ContentType = 'application/json'

$bytes = [System.Text.Encoding]::UTF8.GetBytes('')
$request.ContentLength = $bytes.Length

$stream = $request.GetRequestStream()
$stream.Write($bytes, 0, $bytes.Length)
$stream.Close()

try {
 $response = $request.GetResponse()
} catch [System.Net.WebException] {
 $response = $_.Exception.Response
}

$reader = [System.IO.StreamReader]::new($response.GetResponseStream())
$content = $reader.ReadToEnd()
$reader.Close()

Write-Host 'Status: '.StatusCode
Write-Host 'Content:' $content
