import Poll from '../models/Poll.js';

/**
 * Агрегація голосувань для побудови діаграми.
 * @param {String} type Тип голосувань: "active" або "created".
 * @param {String} period Часовий період: "7days", "1month", "6months", "1year".
 * @returns {Object} Статистика голосувань у вигляді об'єкта.
 */



// /votes/all?type=created&period=1year -----   створенні в період
// /votes/all?type=active&period=1year  ----- завершилися в період
export const aggregatePolls = async (type, period) => {
    const today = new Date();
    let startDate;

   
    switch (period) {
        case '7days':
            startDate = new Date(today);
            startDate.setDate(startDate.getDate() - 7);
            break;
        case '1month':
            startDate = new Date(today);
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case '6months':
            startDate = new Date(today);
            startDate.setMonth(startDate.getMonth() - 6);
            break;
        case '1year':
            startDate = new Date(today);
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        default:
            throw new Error('Invalid period');
    }

   
    let filter;
    if (type === 'active') {
       
        filter = { endTime: { $lte: today }, isClosed: true };
    } else {
        
        filter = { createdAt: { $gte: startDate, $lte: today } };
    }

    
    const polls = await Poll.find(filter);

    const stats = {};

    
    if (period === '7days') {
        for (let i = 0; i < 7; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);
            day.setHours(0, 0, 0, 0);

            const startOfDay = new Date(day);  
            const endOfDay = new Date(day);   
            endOfDay.setHours(23, 59, 59, 999);

            const key = startOfDay.toISOString().split('T')[0]; 

            stats[key] = polls.filter(poll => {
                const date = type === 'active' ? poll.endTime : poll.createdAt;
                return date >= startOfDay && date <= endOfDay; 
            }).length;
        }
    } else if (period === '1month') {
        for (let i = 0; i < 4; i++) {
            const weekStart = new Date(today);
            weekStart.setDate(weekStart.getDate() - (7 * i)); 
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() - 6);

            const key = `Week ${4 - i}`; 

            stats[key] = polls.filter(poll => {
                const date = type === 'active' ? poll.endTime : poll.createdAt;
                return date >= weekEnd && date <= weekStart;
            }).length;
        }
    } else if (period === '6months' || period === '1year') {
        const months = period === '6months' ? 6 : 12;

        for (let i = 0; i < months; i++) {
            const monthStart = new Date(today);
            monthStart.setMonth(monthStart.getMonth() - i);
            monthStart.setDate(1); 
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthStart.getMonth() + 1);
            monthEnd.setDate(0);

            const key = monthStart.toLocaleString('en-US', { month: 'short' }); 

            stats[key] = polls.filter(poll => {
                const date = type === 'active' ? poll.endTime : poll.createdAt;
                return date >= monthStart && date <= monthEnd;
            }).length;
        }
    }

    return stats;
};


