
import cron from 'node-cron';
import Poll from "../models/Poll.js";

export const closePollbyTime = async () => {
    try {
        const timeNow = new Date();

        // Знайдемо голосування, що мають бути закриті
        const pollsToClose = await Poll.find({
            isClosed: false,
            endTime: { $lt: timeNow },  // Перевіряємо, чи закінчився час голосування
        });

        if (pollsToClose.length === 0) {
            console.log("No polls to close.");
            return;
        }

        // Оновлюємо кожне голосування
        for (const poll of pollsToClose) {
            poll.isClosed = true;
            poll.winner = calculateResults(poll);  // Підрахунок результатів голосування
            await poll.save();  // Зберігаємо зміни

            console.log(`Poll with ID ${poll._id} is closed.`);
        }
    } catch (error) {
        console.error("Error when checking time:", error);
    }
};

const calculateResults = (poll) => {
    let winner = null;
    let maxVotes = 0;

    // Перевіряємо всі опції голосування і вибираємо переможця
    poll.options.forEach(option => {
        if (option.voteCount > maxVotes) {
            maxVotes = option.voteCount;
            winner = option.optionText;
        }
    });

    return winner;
};


cron.schedule('*/1 * * * *', closePollbyTime);  
