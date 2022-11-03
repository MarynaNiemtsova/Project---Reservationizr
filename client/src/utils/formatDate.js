import { format } from "date-fns";

const formatDate = (date) => format(new Date(date), "h:mmaaa EEE d LLL, yyyy");

export { formatDate };
