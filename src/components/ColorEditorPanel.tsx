import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ColorEditorPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>עורך צבעים</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">כאן ניתן יהיה לשנות ערכי צבע של התצוגה.</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>סגור</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorEditorPanel;
