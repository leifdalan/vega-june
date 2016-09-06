import { fetchAllPostsFromTumblr } from './actions';
import { CronJob } from 'cron';

const job = new CronJob(
  '0 */5 * * * *',
  () => {
    console.log('running job:');
    fetchAllPostsFromTumblr().then(() => {
      console.log('fetch complete');
    });
  },
  () => {
    console.log('job stopped');
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);
job.start();
export default job;
