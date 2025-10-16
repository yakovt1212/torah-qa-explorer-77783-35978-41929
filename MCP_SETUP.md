# Model Context Protocol (MCP) Integration

## MCP Chrome Extension
להפוך את כרום לשרת MCP חכם: [hangwin/mcp-chrome](https://github.com/hangwin/mcp-chrome)

- התקן את התוסף כרום: https://github.com/hangwin/mcp-chrome#installation
- הפעל את התוסף, קבל כתובת MCP Server (לרוב: ws://localhost:8123)

## SDK TypeScript
ה-SDK מותקן בפרויקט (`@modelcontextprotocol/typescript-sdk`).

דוגמה לשימוש:
```ts
import { MCPClient } from '@modelcontextprotocol/typescript-sdk';
const client = new MCPClient('ws://localhost:8123');
// client.callTool(...)
```

## MCP Playwright
הותקן בפרויקט: `@executeautomation/mcp-playwright`

- מדריך: https://github.com/executeautomation/mcp-playwright
- ברירת מחדל: השרת מאזין ב-`ws://localhost:8124`

### דוגמת קוד TypeScript
```ts
import { MCPClient } from '@modelcontextprotocol/typescript-sdk';
const playwrightClient = new MCPClient('ws://localhost:8124');

async function run() {
  const result = await playwrightClient.callTool('playwright.launch', { browser: 'chromium' });
  console.log(result);
}
run();
```

### הפעלה
1. התקן והפעל MCP Playwright (ראה מדריך)
2. הרץ את הדוגמה לעיל

## רשימת MCP מומלצים
- [Awesome MCP Servers](https://github.com/appcypher/awesome-mcp-servers)
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- [modelcontextprotocol/registry](https://github.com/modelcontextprotocol/registry)

## הפעלה מהירה
1. התקן את MCP Chrome Extension
2. הפעל את השרת (ws://localhost:8123)
3. השתמש ב-SDK בפרויקט שלך
