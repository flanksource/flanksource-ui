import { TimeRangeList } from "./TimeRangeList";

export const TimeRangePickerBody = ({ isOpen, closePicker }) => {

  const visible = isOpen ? 'visible' : 'invisible';
    
  return (
    <div className={`${visible} flex justify-center cursor-auto w-max transition duration-200 ease bg-gray-50 h-96 absolute rounded-md border-2 border-gray-300 z-50`} style={{top: 'calc(100% + 4px)', left: '-2px', width: '550px'}}>
      <div className="p-3 border-r-2 border-gray-300 w-3/5">
        <div>Absolute time range</div>
        <div>
          <div  className="my-3">
            <div className="my-3">
              <div className="text-sm">From</div>
              <div>
                now-2h
              </div>
              
            </div>
            <div>
              <div className="text-sm">To</div>
              <div>
                now
              </div>
              
            </div>
          </div>
          <button className="block bg-blue-200 hover:bg-blue-300 rounded-sm px-2 py-1 transition duration-200 ease">Apply time range</button>
        </div>
      </div>
      <div className="w-2/5 overflow-y-auto">
        <TimeRangeList />
      </div>
    </div>
  )
};