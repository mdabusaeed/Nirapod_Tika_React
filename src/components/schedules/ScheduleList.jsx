import React from 'react';

const ScheduleList = ({ schedules }) => {
    return (
        <div>
            {schedules.map((schedule) => (
                <div key={schedule.id}>
                    <h3>{schedule.title}</h3>
                    <p>{schedule.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ScheduleList;