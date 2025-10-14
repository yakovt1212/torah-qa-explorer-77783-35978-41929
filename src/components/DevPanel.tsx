import { useState, useEffect } from 'react';
import { 
  Settings, 
  Terminal, 
  GitBranch, 
  RefreshCw, 
  Copy, 
  Check,
  Trash2,
  GitCommit as GitCommitIcon,
  Clock,
  FileText,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  fetchGitHistory, 
  fetchGitStatus, 
  fetchGitBranches,
  getRelativeTime,
  type GitCommit as GitCommitType,
  type GitStatus,
  type GitBranch as GitBranchType
} from '@/utils/gitHistory';

interface ConsoleLog {
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: string;
  args: unknown[];
}

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [copiedConsole, setCopiedConsole] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);
  const [gitHistory, setGitHistory] = useState<GitCommitType[]>([]);
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [gitBranches, setGitBranches] = useState<GitBranchType[]>([]);
  const [isLoadingGit, setIsLoadingGit] = useState(false);

  // Only show in development mode
  const isDev = import.meta.env.DEV;

  // Debug: Log when component mounts
  useEffect(() => {
    if (isDev) {
      console.log('🎯 DevPanel mounted - isDev:', isDev);
      console.log('🎯 Panel state:', { isOpen });
    }
  }, [isDev, isOpen]);

  // Intercept console methods
  useEffect(() => {
    if (!isDev) return;

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    const createLogger = (type: ConsoleLog['type'], original: (...args: unknown[]) => void) => {
      return (...args: unknown[]) => {
        original.apply(console, args);
        setConsoleLogs(prev => [...prev, {
          type,
          message: args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '),
          timestamp: new Date().toLocaleTimeString('he-IL'),
          args
        }]);
      };
    };

    console.log = createLogger('log', originalLog);
    console.warn = createLogger('warn', originalWarn);
    console.error = createLogger('error', originalError);
    console.info = createLogger('info', originalInfo);

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
    };
  }, [isDev]);

  // Function to load Git data
  const loadGitData = async () => {
    setIsLoadingGit(true);
    try {
      const [history, status, branches] = await Promise.all([
        fetchGitHistory(20),
        fetchGitStatus(),
        fetchGitBranches()
      ]);

      setGitHistory(history);
      setGitStatus(status);
      setGitBranches(branches);
    } catch (error) {
      console.error('Error loading git data:', error);
      toast.error('שגיאה בטעינת נתוני Git');
    } finally {
      setIsLoadingGit(false);
    }
  };

  // Load Git data when panel opens
  useEffect(() => {
    if (!isDev || !isOpen || gitHistory.length > 0) return;
    loadGitData();
  }, [isDev, isOpen, gitHistory.length]);

  const handleCopyConsole = () => {
    const text = consoleLogs
      .map(log => `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    setCopiedConsole(true);
    toast.success('הועתק ללוח!');
    setTimeout(() => setCopiedConsole(false), 2000);
  };

  const handleCopyGitHistory = () => {
    const text = gitHistory
      .map(commit => 
        `${commit.hash} - ${commit.message}\nמחבר: ${commit.author}\nתאריך: ${new Date(commit.date).toLocaleString('he-IL')}\nקבצים: ${commit.files.join(', ')}\n`
      )
      .join('\n---\n\n');
    
    navigator.clipboard.writeText(text);
    setCopiedGit(true);
    toast.success('היסטוריה הועתקה ללוח!');
    setTimeout(() => setCopiedGit(false), 2000);
  };

  const handleClearConsole = () => {
    setConsoleLogs([]);
    toast.info('Console נוקה');
  };

  const handlePanelToggle = (open: boolean) => {
    console.log('🎯 Panel toggle clicked:', open);
    setIsOpen(open);
  };

  const handleGitCommitAndPush = async () => {
    console.log('💾 Git commit and push clicked');
    
    try {
      // Check if there are changes first
      const status = await fetchGitStatus();
      if (!status || (status.staged.length === 0 && status.modified.length === 0 && status.untracked.length === 0)) {
        toast.info('אין שינויים לשמירה');
        return;
      }

      toast.loading('מריץ סקריפט Git...', { id: 'git-push' });
      
      // Trigger VS Code task using vscode:// protocol
      // This will open the task runner in VS Code
      const taskCommand = 'vscode://task/Git:%20Commit%20and%20Push';
      
      // Try to run the task
      window.open(taskCommand, '_self');
      
      toast.success('✅ Task מופעל! בדוק את הטרמינל למטה', { id: 'git-push', duration: 3000 });
      
      // Auto-refresh git data after 5 seconds
      setTimeout(() => {
        loadGitData();
        toast.success('✅ Git history עודכן!');
      }, 5000);
      
    } catch (error) {
      console.error('Error during git commit and push:', error);
      toast.error('❌ שגיאה בהפעלת Task');
    }
  };

  const handleHardRefresh = async () => {
    console.log('🔄 Hard refresh clicked');
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear IndexedDB
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        databases.forEach(db => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        });
      }

      toast.success('כל המטמון נוקה! מרענן...', {
        description: 'הדף יטען מחדש בעוד שנייה'
      });

      // Hard reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error during hard refresh:', error);
      toast.error('שגיאה בניקוי המטמון');
    }
  };

  if (!isDev) return null;

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warn': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-foreground';
    }
  };

  const getLogBadgeVariant = (type: ConsoleLog['type']): "default" | "destructive" | "outline" | "secondary" => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warn': return 'outline';
      case 'info': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="fixed top-4 left-4 z-[9999] flex gap-2 pointer-events-auto">
      {/* Git Commit & Push Button */}
      <Button
        onClick={handleGitCommitAndPush}
        variant="outline"
        size="icon"
        className="bg-background/95 backdrop-blur-sm border-2 border-green-500/50 hover:border-green-500 hover:bg-green-500/10 shadow-lg cursor-pointer"
        title="שמור ל-Git ודחוף ל-GitHub"
        type="button"
      >
        <GitCommitIcon className="h-4 w-4 text-green-500" />
      </Button>

      {/* Hard Refresh Button */}
      <Button
        onClick={handleHardRefresh}
        variant="outline"
        size="icon"
        className="bg-background/95 backdrop-blur-sm border-2 border-orange-500/50 hover:border-orange-500 hover:bg-orange-500/10 shadow-lg cursor-pointer"
        title="ריענון חזק - ניקוי מלא של כל המטמון"
        type="button"
      >
        <RefreshCw className="h-4 w-4 text-orange-500" />
      </Button>

      {/* Dev Panel */}
      <Sheet open={isOpen} onOpenChange={handlePanelToggle}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/95 backdrop-blur-sm border-2 border-primary/50 hover:border-primary shadow-lg cursor-pointer"
            title="פאנל פיתוח - לחץ לפתיחה"
            type="button"
            onClick={() => console.log('🖱️ Button clicked directly')}
          >
            <Settings className="h-4 w-4 animate-spin-slow" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[600px] sm:w-[700px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              פאנל פיתוח
            </SheetTitle>
            <SheetDescription>
              כלים לפיתוח ודיבוג - זמין רק במצב פיתוח
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="console" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="console" className="gap-2">
                <Terminal className="h-4 w-4" />
                Console
                {consoleLogs.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {consoleLogs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="git" className="gap-2">
                <GitBranch className="h-4 w-4" />
                Git History
                {gitHistory.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {gitHistory.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Console Tab */}
            <TabsContent value="console" className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyConsole}
                  variant="outline"
                  size="sm"
                  className="gap-2 flex-1"
                  disabled={consoleLogs.length === 0}
                >
                  {copiedConsole ? (
                    <>
                      <Check className="h-4 w-4" />
                      הועתק!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      העתק הכל
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleClearConsole}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={consoleLogs.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  נקה
                </Button>
              </div>

              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                {consoleLogs.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Terminal className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>אין הודעות console</p>
                    <p className="text-sm">הודעות יופיעו כאן כשיש פעילות</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {consoleLogs.map((log, index) => (
                      <div
                        key={index}
                        className="p-2 rounded border border-border/50 hover:border-border transition-colors"
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <Badge variant={getLogBadgeVariant(log.type)} className="text-xs">
                            {log.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {log.timestamp}
                          </span>
                        </div>
                        <pre className={`text-sm whitespace-pre-wrap font-mono ${getLogColor(log.type)}`}>
                          {log.message}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Git History Tab */}
            <TabsContent value="git" className="space-y-4">
              <div className="flex flex-col gap-3">
                {/* Git Status Summary */}
                {gitStatus && (
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{gitStatus.branch}</span>
                    </div>
                    {gitStatus.ahead > 0 && (
                      <Badge variant="outline" className="gap-1">
                        <Plus className="h-3 w-3" />
                        {gitStatus.ahead} commits ahead
                      </Badge>
                    )}
                    {gitStatus.modified.length > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        <FileText className="h-3 w-3" />
                        {gitStatus.modified.length} modified
                      </Badge>
                    )}
                    {gitStatus.untracked.length > 0 && (
                      <Badge variant="outline" className="gap-1">
                        <Plus className="h-3 w-3" />
                        {gitStatus.untracked.length} untracked
                      </Badge>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopyGitHistory}
                    variant="outline"
                    size="sm"
                    className="gap-2 flex-1"
                    disabled={gitHistory.length === 0}
                  >
                    {copiedGit ? (
                      <>
                        <Check className="h-4 w-4" />
                        הועתק!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        העתק היסטוריה
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[450px] w-full rounded-md border p-4">
                {isLoadingGit ? (
                  <div className="text-center text-muted-foreground py-8">
                    <RefreshCw className="h-12 w-12 mx-auto mb-2 opacity-50 animate-spin" />
                    <p>טוען היסטוריית Git...</p>
                  </div>
                ) : gitHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <GitBranch className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>אין היסטוריית Git</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {gitHistory.map((commit, index) => (
                      <div
                        key={commit.hash}
                        className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors space-y-3"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <GitCommitIcon className="h-4 w-4 text-primary" />
                              <Badge variant="outline" className="font-mono text-xs">
                                {commit.hash}
                              </Badge>
                              {index === 0 && (
                                <Badge className="bg-green-500">Latest</Badge>
                              )}
                              <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {getRelativeTime(commit.date)}
                              </Badge>
                            </div>
                            <p className="font-medium text-sm leading-relaxed">
                              {commit.message}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                👤 {commit.author}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                📅 {new Date(commit.date).toLocaleString('he-IL')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        {(commit.additions !== undefined || commit.deletions !== undefined) && (
                          <div className="flex gap-3 text-xs">
                            {commit.additions !== undefined && (
                              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <Plus className="h-3 w-3" />
                                <span>{commit.additions} הוספות</span>
                              </div>
                            )}
                            {commit.deletions !== undefined && (
                              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                <Minus className="h-3 w-3" />
                                <span>{commit.deletions} מחיקות</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Files */}
                        {commit.files.length > 0 && (
                          <div className="pt-2 border-t border-border/50">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <p className="text-xs font-medium">
                                קבצים ששונו ({commit.files.length}):
                              </p>
                            </div>
                            <div className="space-y-1 max-h-[150px] overflow-y-auto">
                              {commit.files.map((file, i) => (
                                <div
                                  key={i}
                                  className="text-xs font-mono bg-muted/50 px-2 py-1.5 rounded hover:bg-muted transition-colors"
                                >
                                  {file}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
}
