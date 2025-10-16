import { useState, memo } from "react";
import { ChevronDown, ChevronUp, MessageCircle, MessageSquare } from "lucide-react";
import { FlatPasuk } from "@/types/torah";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toHebrewNumber } from "@/utils/hebrewNumbers";
import { TextHighlighter } from "@/components/TextHighlighter";
import { NotesDialog } from "@/components/NotesDialog";
import { useFontSettings } from "@/contexts/FontSettingsContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface PasukDisplayProps {
  pasuk: FlatPasuk;
  seferId: number;
}

export const PasukDisplay = memo(({ pasuk, seferId }: PasukDisplayProps) => {
  const { fontSettings } = useFontSettings();
  const isMobile = useIsMobile();
  
  // Safety check: ensure content exists and is an array
  const content = pasuk.content || [];
  
  const totalQuestions = content.reduce((sum, content) => sum + content.questions.length, 0);
  const totalAnswers = content.reduce(
    (sum, content) => sum + content.questions.reduce((qSum, q) => qSum + q.perushim.length, 0),
    0
  );
  const pasukId = `${pasuk.perek}-${pasuk.pasuk_num}`;

  if (totalQuestions === 0) return null;
  return (
    <Card className="overflow-hidden border-r-4 border-r-accent shadow-md hover:shadow-lg transition-all">
      <CardHeader className="bg-gradient-to-l from-secondary/30 to-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 justify-between">
              <NotesDialog pasukId={pasukId} pasukText={pasuk.text} />
              <Badge variant="outline" className="font-bold">
                פרק {toHebrewNumber(pasuk.perek)} פסוק {toHebrewNumber(pasuk.pasuk_num)}
              </Badge>
            </div>
            <div
              style={{
                fontFamily: fontSettings.pasukFont,
                fontSize: `${fontSettings.pasukSize}px`,
              }}
            >
              <TextHighlighter text={pasuk.text} pasukId={pasukId} />
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Badge variant="secondary" className="gap-1">
              <MessageCircle className="h-3 w-3" />
              {totalQuestions}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <MessageSquare className="h-3 w-3" />
              {totalAnswers}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {content.map((contentItem) =>
          contentItem.questions.length > 0 ? (
            <div key={contentItem.id} className="space-y-3">
              {contentItem.title && (
                <h4 
                  className={cn(
                    "font-semibold text-primary border-r-2 border-accent pr-3",
                    "text-right",
                    "text-sm sm:text-base",
                    "whitespace-normal"
                  )}
                  style={{
                    fontFamily: fontSettings.questionFont,
                    fontSize: `${isMobile ? 14 : fontSettings.questionSize}px`,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {contentItem.title}
                </h4>
              )}
              {contentItem.questions.map((question) => (
                <QuestionSection 
                  key={question.id} 
                  question={question} 
                  showAnswers={true}
                  isMobile={isMobile}
                  fontSettings={fontSettings}
                />
              ))}
            </div>
          ) : null
        )}
      </CardContent>
    </Card>
  );
});

const QuestionSection = memo(({ question, showAnswers = true, isMobile = false, fontSettings }: { question: any; showAnswers?: boolean; isMobile?: boolean; fontSettings: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-4 h-auto text-right bg-muted/50 hover:bg-muted"
        >
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <MessageSquare className="h-3 w-3" />
              {question.perushim.length}
            </Badge>
            {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
          </div>
          <span 
            className={cn(
              "flex-1 text-right",
              "text-sm sm:text-base",
              "whitespace-normal"
            )}
            style={{
              fontFamily: fontSettings.questionFont,
              fontSize: `${isMobile ? 14 : fontSettings.questionSize}px`,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {question.text}
          </span>
        </Button>
      </CollapsibleTrigger>

      {showAnswers && (
        <CollapsibleContent className="space-y-3 pr-4">
          {question.perushim.map((perush: any) => (
            <AnswerSection key={perush.id} perush={perush} isMobile={isMobile} fontSettings={fontSettings} />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
});

const AnswerSection = memo(({ perush, isMobile = false, fontSettings }: { perush: any; isMobile?: boolean; fontSettings: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between mb-2"
        >
          <Badge variant="secondary" className="font-semibold">
            {perush.mefaresh}
          </Badge>
          <span className="flex items-center gap-2">
            {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </span>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="p-4 bg-card rounded-md border-r-2 border-accent">
          <p 
            className={cn(
              "leading-relaxed text-muted-foreground",
              "text-right whitespace-normal"
            )}
            style={{
              fontFamily: fontSettings.answerFont,
              fontSize: `${isMobile ? 14 : fontSettings.answerSize}px`,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {perush.text}
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});
