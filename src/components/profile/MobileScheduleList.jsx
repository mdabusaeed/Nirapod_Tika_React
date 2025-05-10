import React from 'react';
import PaymentInfoDebug from './PaymentInfoDebug';
import { getStatusText, getPaymentMethodText } from '../../services/schedule-service';

const MobileScheduleList = ({ 
  schedules, 
  formatDateTime, 
  formatDate, 
  getOrderDate, 
  getDeliveryDate, 
  getVaccinePrice, 
  handlePayment, 
  handleDeleteSchedule, 
  deletingId,
  showDebug
}) => {
  return (
    <div className="md:hidden space-y-4">
      {schedules.map((schedule) => (
        <div key={schedule.id} className="border rounded-lg overflow-hidden">
          <div className="bg-amber-50 px-4 py-3 border-b">
            <div className="font-medium">
              {schedule.vaccine_name || 
              (schedule.vaccine && schedule.vaccine.name) || 
              `Vaccine #${schedule.vaccine}` || 
              'Unknown Vaccine'}
            </div>
            {schedule.campaign && (
              <div className="text-xs text-gray-600">
                Campaign: {schedule.campaign.name || `#${schedule.campaign}`}
              </div>
            )}
          </div>
          <div className="px-4 py-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Schedule ID:</span>
              <span className="text-sm font-mono">{schedule.id}</span>
            </div>
            {schedule.transaction_id && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Transaction ID:</span>
                <span className="text-sm font-mono truncate max-w-[200px]">{schedule.transaction_id}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Order Date:</span>
              <span className="text-sm">{formatDateTime(getOrderDate(schedule))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Delivery Date:</span>
              <span className="text-sm">{formatDate(getDeliveryDate(schedule))}</span>
            </div>
            
            {/* Add price display */}
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Price:</span>
              <span className="text-sm font-semibold">
                BDT {schedule.amount || getVaccinePrice(Number(schedule.vaccine?.id || schedule.vaccine)) || 1000}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Status:</span>
              <span className={`text-sm px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${schedule.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  schedule.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  schedule.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                  'bg-blue-100 text-blue-800'}`}>
                {getStatusText(schedule.status)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Payment:</span>
              <span className="text-sm">
                {getPaymentMethodText(schedule.payment_method)}
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col gap-2">
              {/* Add Pay button if payment is online and not paid */}
              {(schedule.payment_method === 'online' || schedule.payment_method === 'Online') && 
               (schedule.payment_status !== 'paid' && schedule.payment_status !== 'completed') && (
                <button
                  onClick={() => handlePayment(schedule)}
                  className="w-full p-3 text-white text-base rounded bg-amber-500 hover:bg-amber-600 font-medium"
                >
                  Pay Now (BDT {schedule.amount || getVaccinePrice(Number(schedule.vaccine?.id || schedule.vaccine)) || 1000})
                </button>
              )}
              <button
                onClick={() => handleDeleteSchedule(schedule.id)}
                disabled={deletingId === schedule.id}
                className={`w-full p-3 text-white text-base rounded 
                  ${deletingId === schedule.id 
                    ? 'bg-gray-400' 
                    : 'bg-red-500 hover:bg-red-600'}`}
              >
                {deletingId === schedule.id ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                    <span>Deleting...</span>
                  </div>
                ) : 'Delete Schedule'}
              </button>
              
              {/* Add debug info */}
              <PaymentInfoDebug schedule={schedule} showDebug={showDebug} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileScheduleList; 