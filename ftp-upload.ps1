$ftpHost = "ftp://ftp.z290882-sa34jc.ps09.zwhhosting.com"
$ftpUser = "admin@softstopshop.com"
$ftpPass = '4p$XtX]SPmxcRsb='
$localFile = "c:\project\ssshop\ssshop_cpanel.zip"
$remotePath = "/ssshop_cpanel.zip"

Write-Host "Uploading ssshop_cpanel.zip to FTP server..."
Write-Host "Server: $ftpHost"

try {
    $ftpUri = "$ftpHost$remotePath"
    $webclient = New-Object System.Net.WebClient
    $webclient.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    
    Write-Host "Uploading..."
    $webclient.UploadFile($ftpUri, $localFile)
    
    Write-Host "Upload Complete!"
} catch {
    Write-Host "Upload failed: $($_.Exception.Message)"
}
