import { useState } from "react";
import { TimeRangePickerBody } from "./TimeRangePickerBody";

export const TimeRangePicker = () => {
  let [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div className="px-2 py-1 bg-gray-50 relative cursor-pointer rounded-md border-2 border-gray-300">
      <div
        className="flex items-center justify-center"
        onClick={
          () => {
            setIsPickerOpen(!isPickerOpen)
          }
        }>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#666"><path d="M12,6a.99974.99974,0,0,0-1,1v4H9a1,1,0,0,0,0,2h3a.99974.99974,0,0,0,1-1V7A.99974.99974,0,0,0,12,6Zm0-4A10,10,0,1,0,22,12,10.01146,10.01146,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.00917,8.00917,0,0,1,12,20Z"></path></svg>
        </div>
        <div className="ml-1">
          Time range: <span>2 hours</span>
        </div>
      </div>
      <TimeRangePickerBody isOpen={isPickerOpen} closePicker={() => setIsPickerOpen(false)}/>
    </div>
  )
};