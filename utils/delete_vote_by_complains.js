import Vote from '../models/Vote.js';
import Poll from '../models/Poll.js';

export default async function handleComplains(req, res) {
    try {
        const pollId = req.params.id;


        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }


        if ((poll.complains / poll.views) > 0.2 && poll.complains > 5) {
            await poll.deleteOne();
            return res.status(200).json({ message: 'Poll deleted due to high complain ratio' });
        }


        res.status(200).json({
            message: 'Complains are under the limit',
            complains: poll.complains,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
