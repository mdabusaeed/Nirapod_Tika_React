import React from 'react';
import PaymentInfoDebug from './PaymentInfoDebug';
import { getStatusText, getPaymentMethodText } from '../../services/schedule-service';

const DesktopScheduleList = ({
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
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
              Vaccine
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
              IDs
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
              Order Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
              Delivery Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
              Payment Method
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {schedules.map((schedule) => (
            <tr key={schedule.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {/* Handle different ways the API might return vaccine info */}
                  {schedule.vaccine_name || 
                   (schedule.vaccine && schedule.vaccine.name) || 
                   `Vaccine #${schedule.vaccine}` || 
                   'Unknown Vaccine'}
                </div>
                {schedule.campaign && (
                  <div className="text-xs text-gray-500">
                    Campaign: {schedule.campaign.name || `#${schedule.campaign}`}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-xs text-gray-700">
                  <span className="font-medium">Schedule:</span> <span className="font-mono">{schedule.id}</span>
                </div>
                {schedule.transaction_id && (
                  <div className="text-xs text-gray-700 mt-1">
                    <span className="font-medium">Transaction:</span> <span className="font-mono">{schedule.transaction_id}</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-700">
                  {formatDateTime(getOrderDate(schedule))}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-700">
                  {formatDate(getDeliveryDate(schedule))}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-semibold text-amber-800">
                  BDT {schedule.amount || getVaccinePrice(Number(schedule.vaccine?.id || schedule.vaccine)) || 1000}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${schedule.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    schedule.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    schedule.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {getStatusText(schedule.status)}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {getPaymentMethodText(schedule.payment_method)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <div>
                  <div className="flex space-x-2 mb-1">
                    {/* Add Pay button if payment is online and not paid */}
                    {(schedule.payment_method === 'online' || schedule.payment_method === 'Online') && 
                     (schedule.payment_status !== 'paid' && schedule.payment_status !== 'completed') && (
                      <button
                        onClick={() => handlePayment(schedule)}
                        className="px-4 py-2 text-white text-sm rounded bg-amber-500 hover:bg-amber-600 flex items-center font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pay Now
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      disabled={deletingId === schedule.id}
                      className={`px-4 py-2 text-white text-sm rounded 
                        ${deletingId === schedule.id 
                          ? 'bg-gray-400' 
                          : 'bg-red-500 hover:bg-red-600'}`}
                    >
                      {deletingId === schedule.id ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-1"></div>
                          <span>Deleting...</span>
                        </div>
                      ) : 'Delete'}
                    </button>
                  </div>
                  
                  {/* Add debug info */}
                  <PaymentInfoDebug schedule={schedule} showDebug={showDebug} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesktopScheduleList; 