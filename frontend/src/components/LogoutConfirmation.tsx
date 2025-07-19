import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

export const LogoutConfirmation = ({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Log out?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Are you sure you want to log out?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
