@echo off
chcp 65001 > nul
echo ===================================================
echo   KATIANA · Droguería y Farmacia Online
echo   Iniciando servidor local de prueba...
echo ===================================================
echo.
echo Abriendo http://127.0.0.1:8095 en tu navegador...
start http://127.0.0.1:8095/
echo Presiona Ctrl+C para detener el servidor.
echo.
python -m http.server 8095
pause
