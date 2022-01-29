import * as add from './add';
import * as message from './message';

const reducer = { ...add, ...message };
export default reducer;
