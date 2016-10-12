
const startTime = new Date();
const history = [{
  type: 'BEGIN_BIG_BROTHER',
  payload: startTime,
  time: startTime,
}];
let lastTime = new Date();

export const getHistory = () => history;
export default callback => store => next => action => {
  const now = new Date();
  const delta = now - lastTime;
  const newAction = {
    ...action,
    delta,
    time: now - startTime,
  };
  history.push(newAction);
  callback(newAction);
  lastTime = now;
  next(action);
};
