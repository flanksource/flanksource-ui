import Calendar from 'react-calendar';
import { TimeRangeList } from "./TimeRangeList";
import "./index.css";
import clsx from "clsx";
import { useState } from 'react';
import { MiniCalendarIcon } from '../../icons/mini-calendar';
import { CloseIconX } from '../../icons/close-x';


export const TimeRangePickerBody = ({ isOpen, closePicker }) => {

  let [showCalendar, setShowCalendar] = useState(false);
    
  return (
    <div className={clsx("time-range-picker-body flex justify-center cursor-auto w-max bg-gray-50 h-96 absolute rounded-sm border border-gray-300 z-50 shadow-lg shadow-gray-200", isOpen && 'active')}>
      <div className={clsx("calendar-wrapper absolute p-2 bg-gray-50 rounded-sm border border-gray-300 shadow-lg shadow-gray-200", showCalendar && 'active')}>
        <div className="flex justify-between align-center mb-2">
          <div>Select a time range</div>
          <div>
            <button
              onClick={() => setShowCalendar(false)}
              className="bg-gray-200 hover:bg-gray-300 rounded-sm px-1.5 py-1.5 transition duration-200 ease"
            >
              <CloseIconX />
            </button>
          </div>
        </div>
        <div>
          <Calendar />
        </div>
      </div>
      <div className="p-3 border-r border-gray-300 w-3/5">
        <div>Absolute time range</div>
        <div>
          <div className="mb-6">
            <div className="my-3">
              <div className="text-sm mb-1">From</div>
              <div className="flex">
                <div>
                  <input className="px-1 py-0.5 border border-gray-300 rounded-sm focus:border-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="flex bg-gray-200 ml-0.5 rounded-sm">
                  <button 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="px-1 mx-1"
                  >
                    <MiniCalendarIcon />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm">To</div>
              <div className="flex">
                <div>
                  <input className="px-1 py-0.5 border border-gray-300 rounded-sm focus:border-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="flex bg-gray-200 ml-0.5 rounded-sm">
                  <button 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="px-1 mx-1"
                  >
                    <MiniCalendarIcon />
                  </button>
                </div>
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