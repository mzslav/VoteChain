import Poll from "../models/Poll";

const closePollbyTime = async () => {
  
    try {

        const timeNow = new Date();

        const pollsToClose = await Poll.find({
            isClosed: false,
            endTime: { $lt: timeNow }, 
        });


        if (pollsToClose.length === 0) {
            console.log("no polls to close");
            return
            
        };


        for (const poll of pollsToClose) {
           
            poll.isClosed = true;

            poll.result = calculateResults(poll);

            await poll.save();

            console.log(`Vote with ID ${poll._id} is finished.`);
        }
    } catch (error) {
        console.error("Error when check time:", error);
    }
};

const calculateResults = (options) => {
    let winner = null;
    let maxVotes = 0;
  
    options.forEach(option => {
      if (option.voteCount > maxVotes) {
        maxVotes = option.voteCount;
        winner = option.optionText;
      }
    });
  
    return winner;
  };
  