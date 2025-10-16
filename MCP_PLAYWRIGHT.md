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
