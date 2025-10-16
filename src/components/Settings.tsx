import { MoreHorizontal, Palette, Type, Layout, Database, Download, Upload, CheckCircle2, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { useFontSettings } from "@/contexts/FontSettingsContext";
import { useQuickSelectorSettings } from "@/contexts/QuickSelectorSettingsContext";
import { useHighlights } from "@/contexts/HighlightsContext";
import { useNotes } from "@/contexts/NotesContext";
import { ColorEditorPanel } from "@/components/ColorEditorPanel";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { downloadDataAsFile, importDataFromFile, restoreData, getDataStats } from "@/utils/dataExport";
import { useState, useRef } from "react";
const themes = [{
  id: "classic" as Theme,
  name: "קלאסי",
  description: "נושא מסורתי בגווני כחול וזהב"
}, {
  id: "royal-gold" as Theme,
  name: "זהב מלכותי",
  description: "נושא יוקרתי בגווני זהב ובורדו"
}, {
  id: "elegant-night" as Theme,
  name: "לילה אלגנטי",
  description: "נושא כהה ומתוחכם"
}, {
  id: "ancient-scroll" as Theme,
  name: "מגילה עתיקה",
  description: "נושא בגווני קלף ודיו"
}];
const fonts = [{
  value: "David",
  label: "דוד"
}, {
  value: "Arial",
  label: "אריאל"
}, {
  value: "'Frank Ruhl Libre'",
  label: "פרנק רוהל"
}, {
  value: "'Miriam Libre'",
  label: "מרים"
}];
export const Settings = () => {
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    fontSettings,
    updateFontSettings
  } = useFontSettings();
  const {
    settings: quickSelectorSettings,
    updateSettings: updateQuickSelectorSettings
  } = useQuickSelectorSettings();
  const {
    highlights
  } = useHighlights();
  const {
    notes,
    questions
  } = useNotes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isColorEditorOpen, setIsColorEditorOpen] = useState(false);
  const stats = getDataStats();
  const handleExport = () => {
    try {
      downloadDataAsFile();
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const data = await importDataFromFile(file);
      restoreData(data, "replace");
      
      // רענון העמוד לטעינת הנתונים החדשים
      setTimeout(() => {
  globalThis.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error importing data:", error);
    } finally {
      setIsImporting(false);
      // איפוס ה-input כדי לאפשר בחירה חוזרת של אותו קובץ
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  return <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 hover:bg-accent/20 transition-colors text-slate-50"
          aria-label="הגדרות"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto text-right">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl">הגדרות</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="themes" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="themes" className="gap-2">
              <span>ערכות נושא</span>
              <Palette className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="fonts" className="gap-2">
              <span>גופנים</span>
              <Type className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="layout" className="gap-2">
              <span>פריסה</span>
              <Layout className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="backup" className="gap-2">
              <span>גיבוי</span>
              <Database className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="space-y-4">
            <RadioGroup value={theme} onValueChange={value => setTheme(value as Theme)}>
              {themes.map(t => <Card key={t.id} className={`p-4 cursor-pointer transition-all hover:shadow-md ${theme === t.id ? "ring-2 ring-primary shadow-lg" : ""}`} onClick={() => setTheme(t.id)}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={t.id} id={t.id} />
                    <div className="flex-1 text-right">
                      <Label htmlFor={t.id} className="text-base font-semibold cursor-pointer">
                        {t.name}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                    </div>
                  </div>
                </Card>)}
            </RadioGroup>

            <Separator className="my-6" />

            {/* Live Color Editor */}
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-dashed border-purple-300 dark:border-purple-700">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                  <Paintbrush className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-bold text-lg mb-2">עורך צבעים מתקדם 🎨</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ערוך את כל משתני ה-CSS בזמן אמת וראה שינויים מיידיים! 
                    מושלם לעיצוב ערכות נושא מותאמות אישית.
                  </p>
                  <Button 
                    onClick={() => setIsColorEditorOpen(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    data-testid="open-color-editor-btn"
                  >
                    <Paintbrush className="w-4 h-4 ml-2" />
                    פתח עורך צבעים חי
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="fonts" className="space-y-6">
            {/* Pasuk Font Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">פסוקים</h3>
              <div className="space-y-3 pr-4">
                <div className="space-y-2">
                  <Label>גופן</Label>
                  <Select value={fontSettings.pasukFont} onValueChange={value => updateFontSettings({
                  pasukFont: value
                })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map(font => <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">{fontSettings.pasukSize}</span>
                    <Label>גודל</Label>
                  </div>
                  <Slider value={[fontSettings.pasukSize]} onValueChange={([value]) => updateFontSettings({
                  pasukSize: value
                })} min={12} max={32} step={1} className="w-full" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Question Font Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">שאלות</h3>
              <div className="space-y-3 pr-4">
                <div className="space-y-2">
                  <Label>גופן</Label>
                  <Select value={fontSettings.questionFont} onValueChange={value => updateFontSettings({
                  questionFont: value
                })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map(font => <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">{fontSettings.questionSize}</span>
                    <Label>גודל</Label>
                  </div>
                  <Slider value={[fontSettings.questionSize]} onValueChange={([value]) => updateFontSettings({
                  questionSize: value
                })} min={12} max={28} step={1} className="w-full" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Answer Font Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">תשובות</h3>
              <div className="space-y-3 pr-4">
                <div className="space-y-2">
                  <Label>גופן</Label>
                  <Select value={fontSettings.answerFont} onValueChange={value => updateFontSettings({
                  answerFont: value
                })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map(font => <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">{fontSettings.answerSize}</span>
                    <Label>גודל</Label>
                  </div>
                  <Slider value={[fontSettings.answerSize]} onValueChange={([value]) => updateFontSettings({
                  answerSize: value
                })} min={10} max={24} step={1} className="w-full" />
                </div>
              </div>
            </div>

            {/* Preview */}
            <Separator />
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-sm text-muted-foreground">תצוגה מקדימה</h4>
              <div className="space-y-2">
                <p style={{
                fontFamily: fontSettings.pasukFont,
                fontSize: `${fontSettings.pasukSize}px`
              }} className="text-right">
                  בְּרֵאשִׁית בָּרָא אֱלֹהִים
                </p>
                <p style={{
                fontFamily: fontSettings.questionFont,
                fontSize: `${fontSettings.questionSize}px`
              }} className="text-right text-muted-foreground">
                  מה הפירוש של המילה "בראשית"?
                </p>
                <p style={{
                fontFamily: fontSettings.answerFont,
                fontSize: `${fontSettings.answerSize}px`
              }} className="text-right text-muted-foreground/80">
                  רש"י: בתחילת בריאת השמים והארץ
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">הגדרות בחירה מהירה</h3>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="start-minimized" className="text-base font-medium cursor-pointer">
                      התחל עם סיידבר ממוזער
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      הסיידבר יופיע כאייקון קטן בהתחלה, לטעינה מהירה יותר
                    </p>
                  </div>
                  <Switch id="start-minimized" checked={quickSelectorSettings.startMinimized} onCheckedChange={checked => updateQuickSelectorSettings({
                  startMinimized: checked
                })} />
                </div>
              </Card>
              <p className="text-sm text-muted-foreground pr-4">
                💡 טיפ: כשהסיידבר ממוזער, הטעינה הראשונית תהיה מהירה יותר והמסך יראה פחות עמוס.
                תמיד אפשר להרחיב אותו בלחיצה על כפתור ההרחבה.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">גיבוי ושחזור נתונים</h3>
              
              {/* סטטיסטיקות */}
              <Card className="p-4 bg-muted/30">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    הנתונים שלך
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="font-bold text-primary">{stats.highlights}</span>
                      <span className="text-muted-foreground">הדגשות</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="font-bold text-primary">{stats.notes}</span>
                      <span className="text-muted-foreground">הערות</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="font-bold text-primary">{stats.questions}</span>
                      <span className="text-muted-foreground">שאלות</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="font-bold text-primary">{stats.sizeKB} KB</span>
                      <span className="text-muted-foreground">גודל</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* כפתורי ייצוא/ייבוא */}
              <div className="space-y-3">
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Download className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <Label className="text-base font-medium">ייצוא נתונים</Label>
                        <p className="text-sm text-muted-foreground">
                          שמור את כל ההערות, השאלות וההדגשות שלך לקובץ גיבוי
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleExport} className="w-full" variant="default">
                      <Download className="h-4 w-4 ml-2" />
                      הורד קובץ גיבוי
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <Label className="text-base font-medium">ייבוא נתונים</Label>
                        <p className="text-sm text-muted-foreground">
                          שחזר נתונים מקובץ גיבוי קודם. הנתונים הקיימים יוחלפו.
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleImportClick} className="w-full" variant="secondary" disabled={isImporting}>
                      {isImporting ? <>מייבא נתונים...</> : <>
                          <Upload className="h-4 w-4 ml-2" />
                          בחר קובץ לשחזור
                        </>}
                    </Button>
                    <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
                  </div>
                </Card>
              </div>

              {/* אזהרות וטיפים */}
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>טיפ:</strong> מומלץ לייצא גיבוי באופן קבוע כדי למנוע אובדן מידע
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>שים לב:</strong> ייבוא נתונים יחליף את כל המידע הקיים
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>אבטחה:</strong> קובץ הגיבוי נשמר רק במכשיר שלך
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Color Editor Panel */}
      <ColorEditorPanel 
        isOpen={isColorEditorOpen} 
        onClose={() => setIsColorEditorOpen(false)} 
      />
    </Dialog>;
};