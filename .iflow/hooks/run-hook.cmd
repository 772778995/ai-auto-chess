: << 'CMDBLOCK'
@echo off
REM 跨平台多语言包装器，用于 hook 脚本。
REM Windows 上：cmd.exe 运行批处理部分，它会查找并调用 bash。
REM Unix 上：shell 将此解释为脚本（: 在 bash 中是无操作）。
REM
REM Hook 脚本使用无扩展名的文件名（例如 "session-start" 而不是
REM "session-start.sh"），这样 Claude Code 的 Windows 自动检测——它
REM 会给任何包含 .sh 的命令添加 "bash" 前缀——就不会产生干扰。
REM
REM 用法：run-hook.cmd <脚本名称> [参数...]

if "%~1"=="" (
    echo run-hook.cmd: 缺少脚本名称 >&2
    exit /b 1
)

set "HOOK_DIR=%~dp0"

REM 尝试在标准位置查找 Git for Windows bash
if exist "C:\Program Files\Git\bin\bash.exe" (
    "C:\Program Files\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)
if exist "C:\Program Files (x86)\Git\bin\bash.exe" (
    "C:\Program Files (x86)\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)

REM 尝试在 PATH 中查找 bash（例如用户安装的 Git Bash、MSYS2、Cygwin）
where bash >nul 2>nul
if %ERRORLEVEL% equ 0 (
    bash "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)

REM 未找到 bash - 静默退出而不是报错
REM（插件仍然可以工作，只是没有 SessionStart 上下文注入）
exit /b 0
CMDBLOCK

# Unix：直接运行指定的脚本
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_NAME="$1"
shift
exec bash "${SCRIPT_DIR}/${SCRIPT_NAME}" "$@"