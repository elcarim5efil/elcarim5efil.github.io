for /f "delims=" %%a in ('dir   /s /b /a-d^|findstr /v /i "op.bat"') do "d:\jpegtran.exe" -copy none -optimize -progressive "%%a" "%%a"