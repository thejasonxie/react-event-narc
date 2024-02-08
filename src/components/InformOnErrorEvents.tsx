import { NarcEventData } from "./EventNarc";
import { InformOnWindowEvents } from "./InformOnWindowEvents";

type ErrorEventType = "error";

type InformOnErrorEventsProps = {
  events?: Array<ErrorEventType>;
  eventParser?: (e: ErrorEvent) => NarcEventData<ErrorEvent>;
  logFormatter?: (e: ErrorEvent) => NarcEventData<ErrorEvent>;
};

const DEFAULT_ERROR_EVENT: Array<ErrorEventType> = ["error"];

export const InformOnErrorEvents = ({
  events = DEFAULT_ERROR_EVENT,
  eventParser,
  logFormatter,
}: InformOnErrorEventsProps) => {
  return (
    <InformOnWindowEvents<ErrorEvent>
      events={events}
      eventDataParser={eventParser}
      eventLogFormatter={logFormatter}
    />
  );
};
