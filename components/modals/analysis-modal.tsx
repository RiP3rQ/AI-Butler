import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  postAnalysisData: any;
  setPostAnalysisData: (data: any) => void;
  isAnalysisLoading: boolean;
}

const AnalysisModal = ({
                         open,
                         setOpen,
                         postAnalysisData,
                         setPostAnalysisData,
                         isAnalysisLoading
                       }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setPostAnalysisData(null);
        setOpen(false);
      }}
    >
      {isAnalysisLoading ? (
        <DialogContent>
          <DialogBody>
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg">Loading analysis...</p>
            </div>
          </DialogBody>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogBody>
            <div
              style={{ background: postAnalysisData?.color }}
              className="flex h-[30px] items-center justify-center py-6 text-white"
            >
              <h2 className="text-2xl font-bold text-black">Analysis</h2>
            </div>
            <div>
              <ul role="list" className="divide-y divide-gray-600">
                <li className="flex items-center justify-between gap-2 px-2 py-2">
                  <div className="w-fit text-xl font-semibold">Subject</div>
                  <div className="text-base">{postAnalysisData?.subject}</div>
                </li>

                <li className="flex items-center justify-between gap-2 px-2 py-2">
                  <div className="w-fit text-xl font-semibold">Summary</div>
                  <div className="text-base">{postAnalysisData?.summary}</div>
                </li>

                <li className="flex items-center justify-between gap-2 px-2 py-2">
                  <div className="w-fit text-xl font-semibold">Mood</div>
                  <div className="text-base">{postAnalysisData?.mood}</div>
                </li>

                <li className="flex items-center justify-between gap-2 px-2 py-2">
                  <div className="w-fit text-xl font-semibold">Negative</div>
                  <div className="text-base">
                    {postAnalysisData?.negative ? "True" : "False"}
                  </div>
                </li>
              </ul>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              onClick={() => {
                setPostAnalysisData(null);
                setOpen(false);
              }}
              className={"w-full flex items-center justify-center"}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AnalysisModal;